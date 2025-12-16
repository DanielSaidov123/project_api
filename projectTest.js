// import fs from "fs";
// async function getAllUsers() {
//   const res = await fetch("https://jsonplaceholder.typicode.com/users");
//   if (!res.ok) {
//     throw new Error(`HTTP error! status: ${res.status}`);
//   }
//   return await res.json();
// }

// function saveUserFile(fileName, data, callback) {
//   const jsonData = JSON.stringify(data, null, 2);
//   fs.writeFile(fileName, jsonData, "utf8", (error) => {
//     if (error) {
//       console.error("Error writing file:", error);
//       if (callback) callback(error);
//       return;
//     }
//     console.log("JSON file created successfully!");
//     if (callback) callback(null);
//   });
// }

// function readUserFile(fileName, callback) {
//   fs.readFile(fileName, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading file:", err);
//       if (callback) callback(err, null);
//       return;
//     }
//     if (callback) callback(null, JSON.parse(data));
//   });
// }

// function getRandomInt(min, max) {
//   min = Math.ceil(min); // עיגול למעלה של הערך המינימלי
//   max = Math.floor(max); // עיגול למטה של הערך המקסימלי
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function addKey(arrData) {
//   for (let i = 0; i < arrData.length; i++) {
//     arrData[i].score = getRandomInt(1, 100);
//   }

//   return arrData;
// }

// function getTopScorers(minScore, callback) {
//   fs.readFile("user.json", "utf8", (error, data) => {
//     if (error) {
//       console.log("שגיאה בקריאת הקובץ:", error);
//       if (callback) callback(error, null);
//       return;
//     }

//     try {
//       const users = JSON.parse(data); // המרה ממחרוזת JSON לאובייקט JS
//       const arr = [];

//       for (let i = 0; i < users.length; i++) {
//         if (users[i].score > minScore) {
//           arr.push(users[i]);
//         }
//       }

//       if (callback) callback(null, arr); // מחזירים את המערך דרך callback
//     } catch (parseError) {
//       console.log("שגיאה בפיענוח JSON:", parseError);
//       if (callback) callback(parseError, null);
//     }
//   });
// }

// async function play() {
//   try {
//     const users = await getAllUsers();

//     saveUserFile("user.json", users, (err) => {
//       if (err) {
//         console.log("הקובץ לא נשמר בגלל שגיאה:", err);
//       } else {
//         console.log("הקובץ נשמר בהצלחה!");

//         readUserFile("user.json", (err, data) => {
//           if (err) {
//             console.log("שגיאה בקריאת הקובץ:", err);
//           } else {
//             const updatedData = addKey(data);
//             console.log(updatedData);

//             // ⬅️ כאן זה המקום הנכון
//             saveUserFile("user.json", updatedData, () => {
//               getTopScorers(50, (err, topPlayers) => {
//                 if (err) {
//                   console.log("שגיאה:", err);
//                 } else {
//                   console.log("Top scorers:", topPlayers);
//                 }
//               });
//             });
//           }
//         });
//       }
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }

// play();

// import fs from "fs/promises";

// /* =========================
//    fetch בסיסי (בלי timeout אמיתי)
// ========================= */
// async function fetchWithTimeout(url) {
//   const res = await fetch(url);

//   if (!res.ok) {
//     throw new Error("Fetch failed");
//   }

//   return await res.json();
// }

// /* =========================
//    קבלת משתמשים מה־API
// ========================= */
// async function getAllUsers() {
//   return await fetchWithTimeout(
//     "https://jsonplaceholder.typicode.com/users"
//   );
// }

// /* =========================
//    שמירת קובץ
// ========================= */
// async function saveToFile(fileName, data) {
//   await fs.writeFile(
//     fileName,
//     JSON.stringify(data, null, 2),
//     "utf8"
//   );
// }

// /* =========================
//    קריאת קובץ
// ========================= */
// async function readFromFile(fileName) {
//   const data = await fs.readFile(fileName, "utf8");
//   return JSON.parse(data);
// }

// /* =========================
//    הוספת score רנדומלי
// ========================= */
// function addScores(users) {
//   for (let i = 0; i < users.length; i++) {
//     users[i].score = Math.floor(Math.random() * 101);
//   }
//   return users;
// }

// /* =========================
//    מציאת משתמשים עם score גבוה
// ========================= */
// async function getTopScorers(minScore) {
//   const users = await readFromFile("users_with_scores.json");
//   const result = [];

//   for (let i = 0; i < users.length; i++) {
//     if (users[i].score > minScore) {
//       result.push(users[i]);
//     }
//   }

//   if (result.length === 0) {
//     throw new Error("No users found");
//   }

//   return result;
// }

// /* =========================
//    הפונקציה הראשית
// ========================= */
// async function main() {
//   try {
//     const users = await getAllUsers();
//     console.log("Fetched users");

//     await saveToFile("users.json", users);
//     console.log("Saved users.json");

//     const usersFromFile = await readFromFile("users.json");

//     const usersWithScores = addScores(usersFromFile);

//     await saveToFile("users_with_scores.json", usersWithScores);
//     console.log("Saved users_with_scores.json");

//     const topUsers = await getTopScorers(70);
//     console.log("Users with score > 70:");
//     console.log(topUsers);

//   } catch (error) {
//     console.log("Error:", error.message);
//   }
// }

// main();


import fs from "fs";

/* =========================
   fetch משתמשים מה-API
========================= */
async function fetchUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Fetch failed");
  return await res.json();
}

/* =========================
   פונקציות fs עם Promise
========================= */
function saveToFile(fileName, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function readFromFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

/* =========================
   הוספת score רנדומלי
========================= */
function addScores(users) {
  return users.map(user => ({ ...user, score: Math.floor(Math.random() * 101) }));
}

/* =========================
   getTopScorers
========================= */
async function getTopScorers(minScore) {
  const users = await readFromFile("users_with_scores.json");
  const topUsers = users.filter(u => u.score > minScore);
  if (topUsers.length === 0) throw new Error("No users found");
  return topUsers;
}

/* =========================
   CRUD עם fetch
========================= */
async function createUser(newUser) {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser)
  });
  const data = await res.json();
  console.log("Created user:", data);
}

async function updateUser(id, updatedData) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData)
  });
  const data = await res.json();
  console.log("Updated user:", data);
}

async function deleteUser(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "DELETE"
  });
  if (res.ok) console.log(`User ${id} deleted`);
  else console.log("Delete failed");
}

/* =========================
   main
========================= */
async function main() {
  try {
    // 1. הבאת משתמשים מה-API
    const users = await fetchUsers();
    console.log("Fetched users");

    // 2. שמירה לקובץ
    await saveToFile("users.json", users);
    console.log("Saved users.json");

    // 3. קריאה מהקובץ
    const usersFromFile = await readFromFile("users.json");

    // 4. הוספת score
    const usersWithScores = addScores(usersFromFile);
    await saveToFile("users_with_scores.json", usersWithScores);
    console.log("Saved users_with_scores.json");

    // 5. מציאת משתמשים עם score > 70
    const topUsers = await getTopScorers(70);
    console.log("Top users (score > 70):");
    console.log(topUsers);

    // 6. דוגמאות CRUD
    await createUser({ name: "Daniel", email: "daniel@test.com" });
    await updateUser(1, { name: "Updated Name" });
    await deleteUser(1);

  } catch (error) {
    console.log("Error:", error.message);
  }
}

main();
