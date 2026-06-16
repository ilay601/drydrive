/**
 * DryDrive Geo-Match Engine - מנוע סיווג, מיון והמלצות ערים חכם
 */

// מאגר מידע המקשר בין חופים לערים המרכזיות והערים הסמוכות להם בישראל
const GEO_RELATIONS = {
    palmahim: { city: "ראשון לציון", neighbors: ["נס ציונה", "רחובות", "יבנה", "בת ים"] },
    gordon: { city: "תל אביב", neighbors: ["רמת גן", "גבעתיים", "בני ברק", "חולון", "הרצליה"] },
    sironit: { city: "נתניה", neighbors: ["כפר יונה", "הרצליה", "רעננה", "כפר סבא", "חדרה"] },
    mika: { city: "אילת", neighbors: ["אילות", "חבל אילות"] }
};

// פונקציה שמסווגת וממיינת את המקלחות שהועלו לפי מידת הקרבה שלהן לחוף
function getSmartRecommendedShowers(beachId) {
    const allShowers = getShowersByBeach(beachId);
    const relation = GEO_RELATIONS[beachId];

    if (!relation) return { exact: allShowers, recommended: [], fallback: [] };

    const categorized = {
        exact: [],       // באותה העיר של החוף
        recommended: [], // בערים סמוכות (מומלץ בדרך)
        fallback: []     // רחוק יותר
    };

    allShowers.forEach(shower => {
        // ניקוי טקסט העיר שהמארח הזין כדי להשוות בצורה מדויקת
        const hostCity = (shower.hostCity || "").trim();

        if (hostCity === relation.city) {
            categorized.exact.push(shower);
        } else if (relation.neighbors.includes(hostCity)) {
            categorized.recommended.push(shower);
        } else {
            categorized.fallback.push(shower);
        }
    });

    return categorized;
}

// שדרוג פונקציית הציור ב-app.js כדי להציג את קטגוריות הערים וההמלצות החכמות
function renderSmartShowerResults(beachId) {
    const container = document.getElementById('showers-list-container');
    const countText = document.getElementById('results-count');
    container.innerHTML = "";

    const data = getSmartRecommendedShowers(beachId);
    const totalCount = data.exact.length + data.recommended.length + data.fallback.length;

    if (totalCount === 0) {
        countText.textContent = "0 מקלחות נמצאו";
        container.innerHTML = `<p style="text-align:center; color:#64748b; margin-top:40px; font-weight:600;">אין עדיין תחנות באזור זה. הוסף תחנה משלך!</p>`;
        return;
    }

    countText.textContent = `נמצאו ${totalCount} אפשרויות רענון סביבך:`;

    // 1. הזרקת מקלחות באותה העיר
    if (data.exact.length > 0) {
        insertSectionHeader(container, `🚀 באותה העיר (${GEO_RELATIONS[beachId].city})`);
        data.exact.forEach(s => insertShowerCardHTML(container, s));
    }

    // 2. הזרקת מקלחות בערים סמוכות (מומלץ בדרך לנסיעה)
    if (data.recommended.length > 0) {
        insertSectionHeader(container, `🚗 מומלץ בדרך שלך (ערים סמוכות)`);
        data.recommended.forEach(s => insertShowerCardHTML(container, s));
    }

    // 3. הזרקת אפשרויות רחוקות יותר
    if (data.fallback.length > 0) {
        insertSectionHeader(container, `🗺️ רחוק יותר (ערים אחרות)`);
        data.fallback.forEach(s => insertShowerCardHTML(container, s));
    }
}

function insertSectionHeader(container, title) {
    const header = document.createElement('div');
    header.style = "font-size: 0.9rem; font-weight: 700; color: #0284c7; margin: 15px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;";
    header.textContent = title;
    container.appendChild(header);
}

function insertShowerCardHTML(container, shower) {
    const card = document.createElement('div');
    card.className = 'shower-card';
    const featuresHTML = shower.features.map(f => `<span class="feature-badge">${f}</span>`).join('');

    card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
                <h3 style="margin:0 0 4px 0; font-size:1.15rem;">${shower.hostName}</h3>
                <span style="font-size:0.75rem; background:#fff7ed; color:#ea580c; padding:2px 6px; border-radius:4px; font-weight:bold; border:1px solid #ffedd5;">
                    📍 ${shower.hostCity || "עיר לא פראטית"}
                </span>
            </div>
            <span class="price">₪${shower.price}</span>
        </div>
        <p style="font-size:0.85rem; color:#64748b; margin:4px 0 8px 0;"><i class="fa-solid fa-car" style="color:#94a3b8; margin-left:4px;"></i> ${shower.distance}</p>
        <div class="shower-features" style="margin-bottom:12px;">${featuresHTML}</div>
        <div class="shower-footer">
            <span style="font-size:0.8rem; color:#64748b;">★ ${shower.rating.toFixed(1)} (חדש)</span>
            <button class="book-btn-sm" onclick="triggerBooking('${shower.id}')">הזמן מקום</button>
        </div>
    `;
    container.appendChild(card);
}

// החלפת פונקציית הציור המקורית ב-app.js לפונקציה החכמה החדשה שלנו
setTimeout(() => {
    if (typeof renderShowerResults !== 'undefined') {
        renderShowerResults = renderSmartShowerResults;
    }
}, 300);