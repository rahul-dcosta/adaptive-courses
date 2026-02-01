# Monorepo Setup for Mobile Apps

**Goal:** Restructure repo to support web + mobile apps with shared code

**Current Structure:**
```
adaptive-courses/
├── app/              ← Next.js web app (keep as-is for now)
├── docs/
├── marketing/
└── ...
```

**Target Structure:**
```
adaptive-courses/
├── apps/
│   ├── web/          ← Move existing app/ here
│   └── mobile/       ← New React Native/Expo app
├── packages/
│   ├── shared/       ← Shared UI components (optional for v1)
│   └── api-client/   ← Shared API client, types
├── docs/
├── marketing/
├── package.json      ← Root package.json (workspace config)
└── turbo.json        ← Turborepo config (optional but recommended)
```

---

## Phase 1: Set Up Workspace (Do This First)

### Step 1: Create Root package.json
```bash
# In /root/projects/adaptive-courses/

cat > package.json << 'EOF'
{
  "name": "adaptive-courses-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:web": "npm run dev --workspace=apps/web",
    "dev:mobile": "npm run start --workspace=apps/mobile",
    "build:web": "npm run build --workspace=apps/web",
    "build:mobile": "npm run build --workspace=apps/mobile"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
EOF
```

### Step 2: Create Directory Structure
```bash
mkdir -p apps packages/api-client
```

### Step 3: Move Existing Web App
```bash
# Move app/ to apps/web/
mv app apps/web

# Update apps/web/package.json name
# Change "name": "adaptive-courses" to "name": "@adaptive-courses/web"
```

---

## Phase 2: Set Up Mobile App (Expo/React Native)

### Step 1: Create Expo App
```bash
cd apps/
npx create-expo-app mobile --template blank-typescript
cd mobile

# Update package.json name
# Change "name": "mobile" to "name": "@adaptive-courses/mobile"
```

### Step 2: Install Dependencies
```bash
cd apps/mobile
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install expo-router  # File-based routing like Next.js
```

### Step 3: Configure Expo for Web + Native
```bash
# apps/mobile/app.json - update this:
{
  "expo": {
    "name": "Adaptive Courses",
    "slug": "adaptive-courses",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "ios": {
      "bundleIdentifier": "com.adaptivecourses.app",
      "supportsTablet": true
    },
    "android": {
      "package": "com.adaptivecourses.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      }
    },
    "web": {
      "bundler": "metro",
      "favicon": "./assets/favicon.png"
    }
  }
}
```

---

## Phase 3: Create Shared API Client

### Step 1: Set Up Package
```bash
cd packages/api-client

cat > package.json << 'EOF'
{
  "name": "@adaptive-courses/api-client",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {
    "@supabase/supabase-js": "latest"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
EOF
```

### Step 2: Create API Client
```bash
mkdir -p packages/api-client/src

cat > packages/api-client/src/index.ts << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Shared types
export interface Course {
  id: string;
  topic: string;
  title: string;
  modules: any[];
  // ... add other fields
}

// Shared API functions
export async function getCourse(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createCourse(topic: string): Promise<Course> {
  // Call your course generation API
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  });
  
  return response.json();
}

// Export all functions
export * from './types';
EOF
```

### Step 3: Use in Web App
```typescript
// apps/web/app/page.tsx
import { getCourse } from '@adaptive-courses/api-client';

// Now both web and mobile can use the same API client
```

### Step 4: Use in Mobile App
```typescript
// apps/mobile/app/index.tsx
import { getCourse } from '@adaptive-courses/api-client';

// Same code, works everywhere
```

---

## Phase 4: Mobile App Structure (Expo Router)

### File Structure
```
apps/mobile/
├── app/
│   ├── index.tsx          # Home/Landing (topic input)
│   ├── generate.tsx       # Course generation screen
│   ├── course/[id].tsx    # Course view (dynamic route)
│   └── _layout.tsx        # Root layout
├── components/
│   ├── TopicInput.tsx
│   ├── CourseModule.tsx
│   └── PaywallModal.tsx
├── assets/
├── app.json
└── package.json
```

### Example: apps/mobile/app/index.tsx
```typescript
import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { createCourse } from '@adaptive-courses/api-client';

export default function HomeScreen() {
  const [topic, setTopic] = useState('');
  const router = useRouter();

  async function handleGenerate() {
    const course = await createCourse(topic);
    router.push(`/course/${course.id}`);
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="What do you want to learn?"
        value={topic}
        onChangeText={setTopic}
        style={styles.input}
      />
      <Button title="Generate Course" onPress={handleGenerate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 }
});
```

---

## Phase 5: Environment Variables

### For Web (apps/web/.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ANTHROPIC_API_KEY=...
STRIPE_SECRET_KEY=...
```

### For Mobile (apps/mobile/.env)
```bash
# Install expo-dotenv
npm install --save-dev dotenv

# Create .env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
# Note: No Anthropic/Stripe keys (those stay server-side)
```

### Configure in app.json
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": process.env.EXPO_PUBLIC_SUPABASE_URL,
      "supabaseKey": process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    }
  }
}
```

---

## Running the Apps

### Web (Next.js)
```bash
npm run dev:web
# Opens http://localhost:3000
```

### Mobile (Expo)
```bash
npm run dev:mobile
# Opens Expo Dev Tools
# Scan QR code with Expo Go app (iOS/Android)
# Or press 'w' to open in web browser
```

### Both Simultaneously
```bash
# Terminal 1
npm run dev:web

# Terminal 2
npm run dev:mobile
```

---

## Key Decisions to Make

### 1. Payment Flow on Mobile
**Options:**
- **A) Link to web for payment** (easier, avoids App Store 30% fee)
  - Mobile shows course preview
  - "Unlock" button opens web browser to Stripe checkout
  - After payment, redirect back to app
  
- **B) Native in-app purchase** (required for App Store distribution eventually)
  - Use Stripe mobile SDK or RevenueCat
  - Pay Apple/Google 15-30% commission
  - Better UX but more complex

**Recommendation for MVP:** Option A (link to web)

### 2. Auth Strategy
**Current:** Guest checkout (no auth)

**For mobile:**
- Keep guest checkout initially
- Add optional "Save my courses" with email
- Full auth (social login) can come later

### 3. Offline Support
**PWA:** Service workers (limited offline)
**Native mobile:** Store courses locally (SQLite/AsyncStorage)

**Recommendation:** Skip offline for MVP, add later

---

## What to Tell Claude Code

### Message 1: Set Up Monorepo
```
We're converting adaptive-courses to a monorepo to support mobile apps.

GOAL: Set up workspace structure so web + mobile can share code.

STRUCTURE:
- apps/web/ (move existing app/ here)
- apps/mobile/ (new Expo/React Native app)
- packages/api-client/ (shared Supabase client, types, API calls)

STEPS:
1. Create root package.json with workspaces config
2. Create apps/ and packages/ directories
3. Move app/ to apps/web/
4. Create Expo app at apps/mobile/ (blank TypeScript template)
5. Create packages/api-client/ with shared Supabase client

DON'T BREAK:
- Existing web app must keep working
- Keep all existing functionality
- Just reorganize files, don't change logic

START: Show me the exact commands to run.
```

### Message 2: Set Up Mobile App
```
Now build the mobile app (Expo/React Native).

USE:
- Expo Router (file-based routing like Next.js)
- @adaptive-courses/api-client (shared code)
- Same Supabase backend as web

SCREENS:
1. Home (topic input)
2. Generate (loading + course generation)
3. Course view (show modules, paywall for locked content)

PAYMENT:
- For MVP, link to web for Stripe checkout (avoid App Store fees)
- After payment on web, user can view course in app

START: Create apps/mobile/app/index.tsx (home screen with topic input).
```

---

## Testing Mobile App

### iOS (Mac only)
```bash
cd apps/mobile
npm start
# Press 'i' to open iOS simulator
```

### Android
```bash
cd apps/mobile
npm start
# Press 'a' to open Android emulator
```

### Web (works on any OS)
```bash
cd apps/mobile
npm start
# Press 'w' to open in browser
```

### Physical Device (Easiest)
```bash
cd apps/mobile
npm start
# Install "Expo Go" app on your phone
# Scan QR code
```

---

## App Store Submission (Later)

### iOS App Store
1. Create Apple Developer account ($99/year)
2. Configure bundle identifier in app.json
3. Create app listing in App Store Connect
4. Build: `eas build --platform ios`
5. Submit: `eas submit --platform ios`
6. Wait 1-7 days for review

### Google Play Store
1. Create Google Play Developer account ($25 one-time)
2. Configure package name in app.json
3. Create app listing in Play Console
4. Build: `eas build --platform android`
5. Submit: `eas submit --platform android`
6. Wait 1-3 hours for review

**For now:** Just get it working locally, submit to stores in Week 2-4.

---

## Success Criteria

- ✅ Web app still works at apps/web/
- ✅ Mobile app runs in Expo Go
- ✅ Both apps use shared @adaptive-courses/api-client
- ✅ Can generate course on mobile
- ✅ Can view course on mobile
- ✅ Payment links to web (for MVP)

---

## Next Steps After Setup

1. Style mobile app (match web design)
2. Add course caching (don't re-fetch on every view)
3. Implement deep linking (web → app, app → web)
4. Add push notifications (Expo Notifications)
5. Submit to App Store + Play Store
6. Add in-app purchase (if required by stores)
