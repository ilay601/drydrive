/**
 * DryDrive Host Dashboard Component - אזור אישי וניהול רווחים למארח
 */

function createDashboardScreenStructure() {
    const appContent = document.getElementById('app-content');
    
    const dashboardSection = document.createElement('section');
    dashboardSection.id = 'screen-dashboard';
    dashboardSection.className = 'app-screen hidden';
    
    // חישוב נתונים מדומים לצורך תצוגת האבטיפוס (רווחים וסטטיסטיקות)
    let totalEarnings = 0;
    let totalBookingsCount = 0;
    
    // סכימת הרווחים מכל המקלחות שהמשתמש העלה לרשימה ב-data.js
    for (const beach in dryDriveData) {
        dryDriveData[beach].forEach(shower => {
            // נניח שכל מקלחת שהועלתה קיבלה באופן מדומה 3 הזמנות ראשוניות
            totalBookingsCount += 3;
            totalEarnings += (shower.price * 3);
        });
    }

    dashboardSection.innerHTML = `
        <div class="dashboard-container" style="padding-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <i class="fa-solid fa-chart-line" style="font-size: 2rem; color: #f59e0b; margin-bottom: 10px;"></i>
                <h2 style="color: white; margin: 0; font-size: 1.4rem;">מרכז הניהול של המארח</h2>
                <p style="color: #94a3b8; font-size: 0.85rem; margin-top: 5px;">מעקב ביצועים ורווחים מהנכס שלך</p>
            </div>

            <!-- קוביות נתונים (Analytics Cards) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                <div style="background: white; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
                    <span style="font-size: 0.8rem; color: #64748b; display: block; font-weight: 600;">סה"כ הכנסות</span>
                    <strong style="font-size: 1.6rem; color: #16a34a; display: block; margin-top: 5px;">₪${totalEarnings}</strong>
                </div>
                <div style="background: white; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
                    <span style="font-size: 0.8rem; color: #64748b; display: block; font-weight: 600;">רענונים שבוצעו</span>
                    <strong style="font-size: 1.6rem; color: #0284c7; display: block; margin-top: 5px;">${totalBookingsCount}</strong>
                </div>
            </div>

            <!-- רשימת פעילויות אחרונות (Activity Log) -->
            <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 15px;">
                <h3 style="font-size: 1rem; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-clock-rotate-left" style="color: #64748b;"></i>
                    <span>הזמנות אחרונות מהחוף</span>
                </h3>
                
                <div id="dashboard-activity-list" style="display: flex; flex-direction: column; gap: 10px;">
                    ${totalBookingsCount === 0 ? 
                        `<p style="text-align:center; color:#64748b; font-size:0.9rem; padding:15px;">עדיין אין הזמנות פעילות. המקלחת שלך ממתינה לרוחצים!</p>` : 
                        `
                        <div style="display:flex; justify-content:space-between; align-items:center; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size:0.85rem;">
                            <div>
                                <strong>רוחץ מחוף פלמחים</strong>
                                <span style="display:block; color:#64748b; font-size:0.75rem;">לפני 22 דקות</span>
                            </div>
                            <span style="color:#16a34a; font-weight:bold;">+ ₪35</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size:0.85rem;">
                            <div>
                                <strong>רוחץ מחוף גורדון</strong>
                                <span style="display:block; color:#64748b; font-size:0.75rem;">לפני שעה וחצי</span>
                            </div>
                            <span style="color:#16a34a; font-weight:bold;">+ ₪60</span>
                        </div>
                        `
                    }
                </div>
            </div>
        </div>
    `;

    appContent.appendChild(dashboardSection);
    
    // הוספת כפתור הטאב התואם בסרגל התחתון של הניווט
    const bottomNav = document.getElementById('bottom-nav');
    const dashboardTab = document.createElement('button');
    dashboardTab.className = 'nav-item';
    dashboardTab.setAttribute('data-target', 'screen-dashboard');
    dashboardTab.innerHTML = `
        <i class="fa-solid fa-chart-pie"></i>
        <span>ביצועים</span>
    `;
    bottomNav.appendChild(dashboardTab);
    
    // רענון מאזיני לחיצה בשביל הטאב החדש שהתווסף
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            if (target && !item.disabled) {
                // קורא לפונקציית הניווט הקיימת בקובץ app.js
                navigateToScreen(target);
            }
        });
    });
}

// הפעלה מושהית כדי לוודא שכל שאר קובצי המערכת נטענו קודם
setTimeout(createDashboardScreenStructure, 150);