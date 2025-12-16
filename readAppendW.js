import fs from 'fs';

// ----------------------------
// קריאה מקובץ JSON
// ----------------------------
function readUserFile(fileName, callback) {
  fs.readFile(fileName, 'utf8', (error, data) => {
    if (error) {
      console.log('File not found or error reading:', error.message);
      callback([]); // מחזירים מערך ריק במקרה של שגיאה
    } else {
      try {
        const parsed = data.trim() ? JSON.parse(data) : [];
        callback(parsed);
      } catch (parseError) {
        console.log('Error parsing JSON, returning empty array:', parseError.message);
        callback([]);
      }
    }
  });
}

// ----------------------------
// כתיבה חדשה (מחליפה תוכן)
// ----------------------------
function saveUserFile(fileName, data, callback) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFile(fileName, jsonData, 'utf8', (error) => {
    if (error) {
      console.error('Error writing file:', error);
      if (callback) callback(error);
      return;
    }
    console.log('JSON file created successfully!');
    if (callback) callback(null);
  });
}

// ----------------------------
// הוספה של אובייקט למערך JSON
// ----------------------------
function appendUserData(fileName, newData, callback) {
  readUserFile(fileName, (jsonArray) => {
    jsonArray.push(newData);
    saveUserFile(fileName, jsonArray, callback);
  });
}

// ----------------------------
// דוגמאות שימוש
// ----------------------------

const userData1 = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  hobbies: ['reading', 'coding', 'gaming']
};

const userData2 = {
  name: 'Jane Smith',
  age: 25,
  email: 'jane@example.com',
  hobbies: ['drawing', 'cycling']
};

// כתיבה חדשה (מחליפה תוכן הקיים)
// saveUserFile('user.json', [userData1]);

// הוספה של אובייקט חדש
appendUserData('user.json', userData2);

// קריאה מהקובץ
readUserFile('user.json', (data) => {
  console.log('Data from file:', data);
});
