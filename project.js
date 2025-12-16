async function getUserWithPosts(userId) {
  const userUrl = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const postsUrl = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;

  // fetch לשניהם במקביל
  const [userRes, postsRes] = await Promise.all([
    fetch(userUrl),
    fetch(postsUrl),
  ]);

  // המרה ל-JSON
  const [user, posts] = await Promise.all([userRes.json(), postsRes.json()]);

  return {
    user,
    posts,
  };
}

// // בדיקה
// getUserWithPosts(1).then(data => {
//   console.log('User:', data.user.name);
//   console.log('Posts:', data.posts.length);
// });

// // TODO: השלם את הפונקציה
// async function checkAPIStatus() {
//   const res = await fetch(`https://jsonplaceholder.typicode.com/`);
//   if (!res.ok) {
//     throw new Error(`"API is offline" ${res.status}`);
//   }
//   return "API is online"
// }

// // בדיקה
// checkAPIStatus().then(status => console.log(status));

async function checkAPIStatus() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/", {
      signal: controller.signal,
    });

    if (!res.ok) {
      return "API is offline";
    }

    return "API is online";
  } catch (error) {
    return "API is offline";
  } finally {
    clearTimeout(timeoutId);
  }
}
// console.log(checkAPIStatus());

// TODO: השלם את הפונקציה
async function loadMultipleUsers(userIds) {
  const userPromises = userIds.map(async (id) => {
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      if (!res.ok) throw new Error("User not found");
      return await res.json();
    } catch (err) {
      return null;
    }
  });
  const users = await Promise.all(userPromises);

   
  return users;
}

// (async () => {
//   const users = await loadMultipleUsers([1, 2, 3, 4, 5]);
//   console.log('Loaded:', users.length, 'users');
//   console.log(users);
// })();

async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to fetch ${url}`);
      const res = await fetch(url);

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      // אם הבקשה הצליחה, החזר את התוצאה
      return await res.json();
    } catch (err) {
      if (attempt === maxRetries) {
        // אם זה הניסיון האחרון, זורק את השגיאה
        throw err;
      }
      // המתנה לפני הניסיון הבא (exponential backoff: 1s, 2s, 4s)
      const delay = 1000 * 2 ** (attempt - 1);
      console.log(`Failed attempt ${attempt}. Retrying in ${delay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// // בדיקה
// fetchWithRetry('https://jsonplaceholder.typicode.com/users/9', 3)
//   .then(user => console.log('Fetched user:', user))
//   .catch(error => console.log('Failed after all retries'));

async function fetchWithTimeout(url, timeout = 5000) {
  // 1. צור AbortController
  const controller = new AbortController();
  const signal = controller.signal;

  // 2. הגדר setTimeout שמבטל את הבקשה אחרי זמן מסוים
  const timeoutId = setTimeout(() => {
    controller.abort(); // מבטל את הבקשה
  }, timeout);

  try {
    // 3. שלח את הבקשה עם signal
    const res = await fetch(url, { signal });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    // 4. נקה את ה-timeout אם הבקשה הצליחה
    clearTimeout(timeoutId);

    return await res.json();
  } catch (err) {
    // 5. טפל ב-AbortError
    if (err.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err; // שגיאה אחרת
  }
}

// בדיקה
// fetchWithTimeout('https://jsonplaceholder.typicode.com/users/9', 3000)
//   .then(data => console.log('Success:', data))
//   .catch(error => console.log('Timeout or error:', error.message));

import fs from 'fs/promises'; // גרסה של fs שתומכת ב-Promises

async function saveUserData() {
  const userData = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    hobbies: ['reading', 'coding', 'gaming']
  };

  const jsonData = JSON.stringify(userData, null, 2);

  try {
    await fs.writeFile('user.json', jsonData, 'utf8');
    console.log('JSON file created successfully!');
  } catch (error) {
    console.error('Error writing file:', error);
  }

  console.log('This runs after trying to write the file');
}

// קריאה לפונקציה
// saveUserData();

 