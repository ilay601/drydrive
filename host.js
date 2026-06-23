/**
 * DryDrive Host Engine - מנוע העלאת מקלחות ורכיב מיקום GPS אמיתי (גרסה יציבה - מותאם למלונות)
 */

function createHostScreenStructure() {
    const appContent = document.getElementById('app-content');
    
    // מניעת כפילויות - אם המסך כבר נוצר, לא ניצור אותו שוב
    if (document.getElementById('screen-host-form')) return;

    const hostSection = document.createElement('section');
    hostSection.id = 'screen-host-form';
    hostSection.className = 'app-screen hidden';
    
    hostSection.innerHTML = `
        <div class="host-form-container" style="padding-bottom: 30px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fa-solid fa-hotel" style="font-size: 2.2rem; color: #0284c7; margin-bottom: 5px;"></i>
                <h2 style="color: #0f172a; margin: 0;">הוסף את תחנת הרענון שלך</h2>
                <p style="color: #64748b; font-size: 0.85rem; margin-top: 5px;">הציעו את מקלחות הספא או הבריכה של המלון שלכם לרענון מהיר</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; background: white; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0;">
                
                <div>
                    <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 4px;">שם המלון או בית העסק:</label>
                    <input type="text" id="new-host-name" placeholder="לדוגמה: מלון דן תל אביב / הילטון ספא" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem;">
                </div>

                <div>
                    <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 4px;">שיוך לחוף הקרוב ביותר:</label>
                    <select id="new-host-beach" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; background-color: #f8fafc;">
                        <option value="palmahim">חוף פלמחים</option>
                        <option value="gordon">חוף גורדון (תל אביב)</option>
                        <option value="sironit">חוף סירונית (נתניה)</option>
                        <option value="mika">חוף מיקה (אילת)</option>
                    </select>
                </div>

                <div>
                    <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 4px;">באיזו עיר המלון נמצא?</label>
                    <input type="text" id="new-host-city" placeholder="לדוגמה: תל אביב, נתניה, ראשון לציון, אילת" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem;">
                </div>

                <div>
                    <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 6px;">מיקום גיאוגרפי מדויק (GPS):</label>
                    <button id="gps-capture-btn" class="primary-btn" style="background: #3b82f6; padding: 10px; font-size: 0.9rem; margin-bottom: 8px; box-shadow: none;">
                        <i class="fa-solid fa-location-crosshairs"></i>
                        <span>📍 לחץ לסנכרון מיקום מלוויין</span>
                    </button>
                    <input type="text" id="new-host-dist" placeholder="מרחק מהחוף (לדוגמה: 2 דקות הליכה)" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem;">
                    <div id="gps-status" style="font-size: 0.75rem; color: #64748b; margin-top: 4px; font-weight: 500;">המיקום הגיאוגרפי לא נקלט עדיין</div>
                </div>

                <div>
                    <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 4px;">מחיר לרענון של 15 דקות (ב-₪):</label>
                    <input type="number" id="new-host-price" placeholder="40" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem;">
                </div>

                <div>
                    <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 4px;">מה המלון מספק במקלחת? (סמן V):</label>
                    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 5px; font-size: 0.9rem;">
                        <label><input type="checkbox" class="host-amenity" value="מקלחת חמה" checked> מקלחת מים חמים 🚿</label>
                        <label><input type="checkbox" class="host-amenity" value="מגבת נקייה"> מגבת נקייה ויבשה 🧼</label>
                        <label><input type="checkbox" class="host-amenity" value="שמפו וסבון"> שמפו וסבון גוף 🧴</label>
                        <label><input type="checkbox" class="host-amenity" value="פן לשיער"> מייבש שיער (פן) 💨</label>
                    </div>
                </div>

                <button id="publish-station-btn" class="primary-btn" style="margin-top: 5px; background: #16a34a; box-shadow: 0 10px 20px -5px rgba(22, 163, 74, 0.3);">
                    <span>פרסם תחנה במלון עכשיו</span>
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                </button>
            </div>
        </div>
    `;

    appContent.appendChild(hostSection);
    
    // מניעת הוספה כפולה של הטאב התחתון ברענונים
    const existingTab = document.querySelector('[data-target="screen-host-form"]');
    if (!existingTab) {
        const bottomNav = document.getElementById('bottom-nav');
        const hostTab = document.createElement('button');
        hostTab.className = 'nav-item';
        hostTab.setAttribute('data-target', 'screen-host-form');
        hostTab.innerHTML = `
            <i class="fa-solid fa-hotel"></i>
            <span>רשום מלון</span>
        `;
        bottomNav.appendChild(hostTab);
    }

    // חיבור מאזיני הלחיצה
    document.getElementById('publish-station-btn').addEventListener('click', handlePublishNewHost);
    document.getElementById('gps-capture-btn').addEventListener('click', captureLiveGPS);
}

let currentCapturedLat = null;
let currentCapturedLng = null;

function captureLiveGPS(e) {
    e.preventDefault();
    const statusDisplay = document.getElementById('gps-status');
    const distanceInput = document.getElementById('new-host-dist');
    
    if (!navigator.geolocation) {
        statusDisplay.textContent = "❌ הדפדפן שלך לא תומך ברכיב GPS.";
        return;
    }
    
    statusDisplay.textContent = "🔄 מתחבר ללוויין ומחפש קואורדינטות...";
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            currentCapturedLat = position.coords.latitude;
            currentCapturedLng = position.coords.longitude;
            statusDisplay.innerHTML = `✅ נקלט! נ"צ: <span style="color:#16a34a; font-weight:bold;">${currentCapturedLat.toFixed(4)}, ${currentCapturedLng.toFixed(4)}</span>`;
            distanceInput.value = "מרחק סרוק לפי GPS";
        },
        (error) => {
            statusDisplay.innerHTML = `⚠️ ללוויין חסום (ריצה מקומית). נ"צ הוגדר אוטומטית.`;
            currentCapturedLat = 32.0827;
            currentCapturedLng = 34.7674;
            distanceInput.value = "300 מטר מהחול";
        }
    );
}

function handlePublishNewHost() {
    const name = document.getElementById('new-host-name').value.trim();
    const beachId = document.getElementById('new-host-beach').value;
    const distText = document.getElementById('new-host-dist').value.trim();
    const cityText = document.getElementById('new-host-city').value.trim();
    const price = parseInt(document.getElementById('new-host-price').value);
    
    const checkedBoxes = document.querySelectorAll('.host-amenity:checked');
    const selectedFeatures = Array.from(checkedBoxes).map(box => box.value);

    if (!name || !distText || !price || !cityText) {
        alert("⚠️ נא למלא את כל שדות החובה כדי לפרסם את תחנת המלון!");
        return;
    }

    const newStationObject = {
        id: "user_host_" + Date.now(),
        hostName: name,
        hostCity: cityText,
        type: "מתחם מלון / ספא",
        distance: distText,
        price: price,
        rating: 5.0,
        features: selectedFeatures.length > 0 ? selectedFeatures : ["מקלחת נקייה"],
        lat: currentCapturedLat || 32.0827,
        lng: currentCapturedLng || 34.7674
    };

    if (!dryDriveData[beachId]) {
        dryDriveData[beachId] = [];
    }
    dryDriveData[beachId].unshift(newStationObject);

    alert(`🎉 תחנת הרענון של המלון פורסמה בהצלחה וממוינת במערכת!`);
    
    // איפוס מוחלט של הטופס
    document.getElementById('new-host-name').value = "";
    document.getElementById('new-host-city').value = "";
    document.getElementById('new-host-dist').value = "";
    document.getElementById('new-host-price').value = "";
    document.getElementById('gps-status').textContent = "המיקום הגיאוגרפי לא נקלט עדיין";
    checkedBoxes.forEach(box => box.checked = false);
    currentCapturedLat = null;
    currentCapturedLng = null;

    navigateToScreen('screen-welcome');
}

setTimeout(createHostScreenStructure, 100);
