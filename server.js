/**
 * DryDrive Core Backend Server - גרסה יציבה ומאובטחת
 */

const express = require('express');
const cors = require('cors');
const app = express();
// שימוש בפורט הדינמי של Render עם גיבוי ל-3000
const PORT = process.env.PORT || 3000; 

app.use(cors()); 
app.use(express.json()); 

// בסיס הנתונים הווירטואלי של הסטארט-אפ
let globalDryDriveDatabase = {
    palmahim: [],
    gordon: [],
    sironit: [],
    mika: []
};

// 1. תיקון ל-app.get: שליחת נתונים לטלפון של הרוחץ
app.get('/api/showers/:beachId', (req, res) => {
    const beachId = req.params.beachId;
    const showersList = globalDryDriveDatabase[beachId] || [];
    res.json(showersList);
});

// 2. תיקון ל-app.post: קבלת מקלחת חדשה מהמארח ושמירתה
app.post('/api/publish', (req, res) => {
    const newShowerData = req.body;
    const beachId = newShowerData.beachId;

    if (!beachId || !globalDryDriveDatabase[beachId]) {
        return res.status(400).json({ error: "חוף לא חוקי" });
    }

    globalDryDriveDatabase[beachId].unshift(newShowerData);
    res.json({ success: true, message: "התחנה נשמרה בשרת בהצלחה!" });
});

// 3. הגדרת נתיב ברירת מחדל כדי שלא יציג עמוד לבן ריק בדפדפן
app.get('/', (req, res) => {
    res.send("🌊 DryDrive Backend Cloud Server Is active and Cloud-Ready!");
});

// הפעלת השרת על הפורט הנכון
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
