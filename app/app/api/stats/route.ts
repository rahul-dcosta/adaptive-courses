import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Get total courses
    const { count: totalCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    // Get paid courses
    const { count: paidCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('paid', true);

    // Get email signups
    const { count: emailSignups } = await supabase
      .from('email_signups')
      .select('*', { count: 'exact', head: true });

    // Get courses generated today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: coursesToday } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Get most popular topics (last 100 courses)
    const { data: recentCourses } = await supabase
      .from('courses')
      .select('topic')
      .order('created_at', { ascending: false })
      .limit(100);

    const topicCounts: Record<string, number> = {};
    recentCourses?.forEach((course) => {
      const topic = course.topic.toLowerCase();
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    const topTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    return NextResponse.json({
      totalCourses: totalCourses || 0,
      paidCourses: paidCourses || 0,
      emailSignups: emailSignups || 0,
      coursesToday: coursesToday || 0,
      revenue: (paidCourses || 0) * 5,
      topTopics,
      lastUpdated: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json({
      totalCourses: 0,
      paidCourses: 0,
      emailSignups: 0,
      coursesToday: 0,
      revenue: 0,
      topTopics: [],
      error: 'Failed to fetch stats',
      lastUpdated: new Date().toISOString()
    }, { status: 500 });
  }
}
