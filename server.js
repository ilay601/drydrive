/**
 * DryDrive Core Backend Server - השרת המרכזי של הסטארט-אפ
 */

// 1. טעינת הספריות להקמת שרת אינטרנט
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000; // השרת ירוץ על פורט 3000 במחשב

// 2. הגדרות אבטחה ואישור קבלת מידע (Middleware)
app.use(cors()); // מאפשר לאפליקציה שלך להתחבר לשרת בצורה מאובטחת
app.use(express.json()); // מאפשר לשרת לקרוא קבצי נתונים (JSON) שהמשתמשים שולחים

// 3. בסיס הנתונים המרכזי של השרת ברשת
let globalDryDriveDatabase = {
    palmahim: [],
    gordon: [],
    sironit: [],
    mika: []
};

// 4. נתיב שרת (API Endpoint) מסוג GET: שליחת הנתונים לרוחצים
app.use('/api/showers/:beachId', (req, res) => {
    const beachId = req.params.beachId;
    const showersList = globalDryDriveDatabase[beachId] || [];
    
    // השרת מחזיר את רשימת המקלחות האמיתית לטלפון של המשתמש
    res.json(showersList);
});

// 5. נתיב שרת (API Endpoint) מסוג POST: קבלת מקלחת חדשה ממארח
app.use('/api/publish', (req, res) => {
    const newShowerData = req.body;
    const beachId = newShowerData.beachId;

    if (!beachId || !globalDryDriveDatabase[beachId]) {
        return res.status(400).json({ error: "חוף לא חוקי" });
    }

    // השרת שומר את הדירה החדשה בבסיס הנתונים שלו
    globalDryDriveDatabase[beachId].unshift(newShowerData);
    
    // החזרת תשובת הצלחה לטלפון של המארח
    res.json({ success: true, message: "התחנה נשמרה בשרת בהצלחה!" });
});

// 6. הפעלת השרת
app.listen(PORT, () => {
    console.log(`🚀 DryDrive Backend Server is running online on: http://localhost:${PORT}`);
});