/**
 * DryDrive Booking Component - רכיב ניהול הזמנות ותשלום
 */

// 1. יצירת אלמנטים למסך ההזמנה דינמית והזרקתם ל-HTML
const bookingScreen = document.getElementById('screen-booking');
let bookingTimerInterval;

function initBookingScreen(showerId, hostName, price, distance) {
    // מעבר למסך ההזמנה
    navigateToScreen('screen-booking');
    
    // בניית תוכן הממשק של מסך התשלום והסיכום
    bookingScreen.innerHTML = `
        <div class="booking-container">
            <div class="booking-card">
                <div class="booking-icon-wrapper">
                    <i class="fa-solid fa-receipt"></i>
                </div>
                <h2>סיכום הזמנה</h2>
                <p class="booking-subtitle">תחנת הרענון שלך כמעט מוכנה</p>
                
                <div class="receipt-details">
                    <div class="receipt-row">
                        <span>מארח:</span>
                        <strong>${hostName}</strong>
                    </div>
                    <div class="receipt-row">
                        <span>מרחק מהחוף:</span>
                        <span>${distance}</span>
                    </div>
                    <div class="receipt-row">
                        <span>זמן שמירת התור:</span>
                        <span id="countdown-timer" class="timer-highlight">15:00</span>
                    </div>
                    <div class="receipt-row total-row">
                        <span>לתשלום:</span>
                        <span class="total-price">₪${price}</span>
                    </div>
                </div>
            </div>

            <!-- טופס תשלום מדומה בעיצוב מובייל נקי -->
            <div class="payment-form">
                <label>פרטי כרטיס אשראי (סימולציה)</label>
                <div class="mock-input">
                    <i class="fa-solid fa-credit-card"></i>
                    <input type="text" placeholder="•••• •••• •••• ••••" disabled>
                </div>
                <button id="confirm-payment-btn" class="primary-btn payment-btn">
                    <span>אשר תשלום וקבל ניווט</span>
                    <i class="fa-solid fa-shield-stroke-check"></i>
                </button>
            </div>
        </div>
    `;

    // הפעלת טיימר ספירה לאחור של 15 דקות (900 שניות)
    startBookingTimer(900);

    // האזנה לכפתור אישור התשלום
    document.getElementById('confirm-payment-btn').addEventListener('click', () => {
        processMockPayment(hostName);
    });
}

// 2. מנוע הטיימר של ההזמנה
function startBookingTimer(durationSeconds) {
    clearInterval(bookingTimerInterval);
    let timer = durationSeconds;
    const timerDisplay = document.getElementById('countdown-timer');

    bookingTimerInterval = setInterval(() => {
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (timerDisplay) {
            timerDisplay.textContent = minutes + ":" + seconds;
        }

        if (--timer < 0) {
            clearInterval(bookingTimerInterval);
            alert("⏰ הזמן המוקצב להזמנה הסתיים. התור שוחרר למשתמשים אחרים.");
            navigateToScreen('screen-results');
        }
    }, 1000);
}

// 3. סימולציית עיבוד תשלום והצלחה
function processMockPayment(hostName) {
    clearInterval(bookingTimerInterval);
    
    // החלפת תוכן המסך למסך ניווט והצלחה של הסטארט-אפ
    bookingScreen.innerHTML = `
        <div class="success-container" style="text-align: center; padding: 40px 20px;">
            <div class="success-icon" style="font-size: 5rem; color: #16a34a; margin-bottom: 20px;">
                <i class="fa-solid fa-circle-check"></i>
            </div>
            <h2 style="color: #0f172a; margin-bottom: 10px;">התשלום עבר בהצלחה!</h2>
            <p style="color: #64748b; margin-bottom: 30px;">המקלחת שוריינה עבורך באופן בלעדי.</p>
            
            <div class="navigation-box" style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 40px;">
                <p style="font-weight: bold; margin-bottom: 15px;">הוראות הגעה אל: ${hostName}</p>
                <button class="primary-btn" style="background: #16a34a;" onclick="window.open('https://waze.com', '_blank')">
                    <i class="fa-solid fa-diamond-turn-right"></i>
                    <span>פתח ניווט ב-Waze</span>
                </button>
            </div>
            
            <button class="primary-btn" style="background: #64748b;" onclick="navigateToScreen('screen-welcome')">
                חזרה למסך הבית
            </button>
        </div>
    `;
}

// 4. חיבור לפונקציית הלחיצה המקורית מקובץ app.js (דורס את ה-alert הישן)
function triggerBooking(showerId) {
    // מוצא את נתוני המקלחת הספציפית מתוך הדאטה הגלובלי
    let foundShower = null;
    for (const beach in dryDriveData) {
        const match = dryDriveData[beach].find(s => s.id === showerId);
        if (match) {
            foundShower = match;
            break;
        }
    }
    
    if (foundShower) {
        initBookingScreen(foundShower.id, foundShower.hostName, foundShower.price, foundShower.distance);
    }
}