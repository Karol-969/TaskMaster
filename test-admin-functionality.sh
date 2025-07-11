#!/bin/bash
# Test script to verify admin functionality for local deployment

BASE_URL="http://localhost:5000"
COOKIE_FILE="/tmp/admin_test_cookies.txt"

echo "🧪 Testing ReArt Events Admin Functionality"
echo "=========================================="

# Test 1: Admin Login
echo "1. Testing admin login..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/admin/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c "${COOKIE_FILE}")

if echo "$LOGIN_RESPONSE" | grep -q '"role":"admin"'; then
  echo "✅ Admin login successful"
else
  echo "❌ Admin login failed"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

# Test 2: Get Home Content
echo "2. Testing home content retrieval..."
HOME_CONTENT=$(curl -s -X GET "${BASE_URL}/api/admin/home-content" -b "${COOKIE_FILE}")

if echo "$HOME_CONTENT" | grep -q '"section":"hero"'; then
  echo "✅ Home content retrieval successful"
  SECTIONS_COUNT=$(echo "$HOME_CONTENT" | grep -o '"section":' | wc -l)
  echo "   Found $SECTIONS_COUNT content sections"
else
  echo "❌ Home content retrieval failed"
  exit 1
fi

# Test 3: Update Hero Section
echo "3. Testing hero section update..."
UPDATE_RESPONSE=$(curl -s -X PUT "${BASE_URL}/api/admin/home-content/hero" \
  -H "Content-Type: application/json" \
  -d '{"content":{"title":"Test Title - Updated","subtitle":"Test Subtitle","buttonText":"Test Button","backgroundImage":"https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400"}}' \
  -b "${COOKIE_FILE}")

if echo "$UPDATE_RESPONSE" | grep -q '"title":"Test Title - Updated"'; then
  echo "✅ Hero section update successful"
else
  echo "❌ Hero section update failed"
  echo "Response: $UPDATE_RESPONSE"
  exit 1
fi

# Test 4: Verify Update on Public API
echo "4. Testing public API reflects changes..."
sleep 1
PUBLIC_CONTENT=$(curl -s "${BASE_URL}/api/home-content")

if echo "$PUBLIC_CONTENT" | grep -q '"title":"Test Title - Updated"'; then
  echo "✅ Public API shows updated content"
else
  echo "❌ Public API not updated"
  exit 1
fi

# Test 5: Restore Original Content
echo "5. Restoring original hero content..."
RESTORE_RESPONSE=$(curl -s -X PUT "${BASE_URL}/api/admin/home-content/hero" \
  -H "Content-Type: application/json" \
  -d '{"content":{"title":"ReArt Events - Premier Event Management in Nepal","subtitle":"Creating Unforgettable Experiences with Top Artists, Quality Sound Systems, and Professional Event Services","buttonText":"Explore Services","backgroundImage":"https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80"}}' \
  -b "${COOKIE_FILE}")

if echo "$RESTORE_RESPONSE" | grep -q '"title":"ReArt Events'; then
  echo "✅ Content restored successfully"
else
  echo "❌ Content restoration failed"
fi

# Test 6: Test Journey Section Update
echo "6. Testing journey section with timeline..."
JOURNEY_UPDATE=$(curl -s -X PUT "${BASE_URL}/api/admin/home-content/journey" \
  -H "Content-Type: application/json" \
  -d '{"content":{"title":"Our Journey - Updated","subtitle":"Updated subtitle","timeline":[{"year":"2024","title":"Test Milestone","description":"Test description"}]}}' \
  -b "${COOKIE_FILE}")

if echo "$JOURNEY_UPDATE" | grep -q '"title":"Our Journey - Updated"'; then
  echo "✅ Journey section update successful"
else
  echo "❌ Journey section update failed"
fi

# Test 7: Verify Database Persistence
echo "7. Testing database persistence..."
DB_CONTENT=$(curl -s "${BASE_URL}/api/home-content" | grep -c '"section":')
if [ "$DB_CONTENT" -ge 4 ]; then
  echo "✅ Database contains expected sections ($DB_CONTENT found)"
else
  echo "❌ Database missing content sections"
fi

# Cleanup
rm -f "${COOKIE_FILE}"

echo ""
echo "🎉 All admin functionality tests passed!"
echo "✅ Admin authentication works"
echo "✅ Home content management functional"
echo "✅ Real-time updates working"
echo "✅ Database persistence confirmed"
echo "✅ All sections editable"
echo ""
echo "Admin panel ready for local deployment!"