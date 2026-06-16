/**
 * DryDrive App Engine - קובץ הלוגיקה והניווט המרכזי (גרסה סופית משולבת)
 */

// 1. תפיסת האלמנטים המרכזיים מה-HTML
const beachSelector = document.getElementById('beach-selector');
const findShowersBtn = document.getElementById('find-showers-btn');
const showersListContainer = document.getElementById('showers-list-container');
const resultsCountText = document.getElementById('results-count');
const backBtn = document.getElementById('back-btn');

let selectedBeachId = "";

// פתיחת כפתור החיפוש אוטומטית לשימוש נוח באבטיפוס
findShowersBtn.disabled = false;

// 2. האזנה לשינוי בבחירת החוף
beachSelector.addEventListener('change', (e) => {
    selectedBeachId = e.target.value;
});

// 3. לחיצה על כפתור "חפשו מקלחות פנויות"
findShowersBtn.addEventListener('click', () => {
    if (!selectedBeachId) {
        alert("נא לבחור חוף תחילה מתוך הרשימה!");
        return;
    }
    
    // מעבר מסך למסך התוצאות
    navigateToScreen('screen-results');
    
    // בדיקה: אם מנוע ההמלצות החכם geo-match נטען, נשתמש בו. אם לא, נשתמש בברירת המחדל.
    if (typeof renderSmartShowerResults === 'function') {
        renderSmartShowerResults(selectedBeachId);
    } else {
        renderBaseShowerResults(selectedBeachId);
    }
});

// 4. פונקציית ברירת המחדל להצגת תוצאות (למקרה שמנוע המיון עוד לא נטען)
function renderBaseShowerResults(beachId) {
    showersListContainer.innerHTML = "";
    const activeShowers = getShowersByBeach(beachId);
    
    if (activeShowers.length === 0) {
        resultsCountText.textContent = "0 מקלחות פנויות נמצאו";
        showersListContainer.innerHTML = `<p style="text-align:center; color:#64748b; margin-top:40px;">אין עדיין תחנות. לחץ על 'להיות מארח' למטה והוסף תחנה!</p>`;
        return;
    }
    
    resultsCountText.textContent = `נמצאו ${activeShowers.length} מקלחות פנויות סביבך:`;

    activeShowers.forEach(shower => {
        const card = document.createElement('div');
        card.className = 'shower-card';
        const featuresHTML = shower.features.map(f => `<span class="feature-badge">${f}</span>`).join('');
        
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <h3 style="margin:0 0 4px 0;">${shower.hostName}</h3>
                    <span style="font-size:0.75rem; background:#fff7ed; color:#ea580c; padding:2px 6px; border-radius:4px; font-weight:bold;">★ ${shower.rating}</span>
                </div>
                <span class="price">₪${shower.price}</span>
            </div>
            <p style="font-size:0.85rem; color:#64748b; margin:4px 0;"><i class="fa-solid fa-location-dot" style="color:#0284c7;"></i> ${shower.distance}</p>
            <div class="shower-features" style="margin-bottom:10px;">${featuresHTML}</div>
            <div class="shower-footer">
                <span style="font-size:0.8rem; color:#64748b;">עיר: ${shower.hostCity || "כללי"}</span>
                <button class="book-btn-sm" onclick="triggerBooking('${shower.id}')">הזמן עכשיו</button>
            </div>
        `;
        showersListContainer.appendChild(card);
    });
}

// 5. פונקציית ניווט ומעבר בין מסכים גלובלית
function navigateToScreen(screenId) {
    // מעלים את כל המסכים הקיימים באפליקציה
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // מציג את המסך המבוקש
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
    
    // ניהול מראה כפתור החזור העליון
    if (screenId === 'screen-welcome') {
        backBtn.classList.add('hidden');
    } else {
        backBtn.classList.remove('hidden');
    }
    
    // עדכון העיצוב הויזואלי של התפריט התחתון
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-target') === screenId) {
            item.classList.add('active');
        }
    });
}

// כפתור חזור בסרגל העליון
backBtn.addEventListener('click', () => {
    navigateToScreen('screen-welcome');
});

// מאזין ניווט גלובלי לתפריט התחתון (טאב בר)
document.getElementById('bottom-nav').addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-item');
    if (!btn) return;
    
    const target = btn.getAttribute('data-target');
    if (target) {
        navigateToScreen(target);
        
        // בונוס: אם עברנו למסך ביצועים (dashboard), נרענן את הנתונים שלו בזמן אמת
        if (target === 'screen-dashboard' && typeof createDashboardScreenStructure === 'function') {
            // מסיר את הישן ומחשב מחדש את הכסף המעודכן
            document.getElementById('screen-dashboard').remove();
            createDashboardScreenStructure();
            navigateToScreen('screen-dashboard');
        }
    }
});