const apiKey = '27tRhbmdC3wHCHybqKQ4vFy0Z0Rq85oX4EEeeuEK'; // 取得したNASAのAPIキーを使用

// ランダムな日付を生成する関数
function getRandomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
}

// ランダムな日付のAPOD API URLを生成
const randomDate = getRandomDate(new Date(1995, 5, 16), new Date()); // APOD APIは1995年6月16日から利用可能
const apodApiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${randomDate}`;

// APOD APIのデータを取得
fetch(apodApiUrl)
    .then(response => response.json())
    .then(data => {
        console.log('NASA APOD APIからのデータ:', data);
        document.getElementById('apod-title').textContent = data.title;
        document.getElementById('apod-image').src = data.url;
        document.getElementById('apod-explanation').textContent = data.explanation;

        // ブックマークボタンのイベントリスナーを追加
        document.getElementById('bookmark-apod').addEventListener('click', () => {
            const bookmarkedData = {
                date: data.date,
                title: data.title,
                url: data.url,
                explanation: data.explanation
            };
            localStorage.setItem(`apod-${data.date}`, JSON.stringify(bookmarkedData));
            alert('ブックマークされました!');
            addBookmarkToList(bookmarkedData);
        });

        document.getElementById("bookmark-delete").addEventListener("click", () => {
            localStorage.clear();
            alert("全てのブックマークを削除しました");
            loadBookmarks();
        });

        // ページ読み込み時に既存のブックマークを表示
        loadBookmarks();
    })
    .catch(error => console.error('NASA APOD APIからのデータ取得エラー:', error));


// ブックマークをHTMLに追加する関数
function addBookmarkToList(bookmark) {
    const bookmarkList = document.getElementById('bookmark-list');
    const bookmarkItem = document.createElement('div');
    bookmarkItem.classList.add('bookmark-item');
    bookmarkItem.innerHTML = `
        <h3>${bookmark.title}</h3>
        <img src="${bookmark.url}" alt="${bookmark.title}" style="width: 100px;">
        <p>${bookmark.explanation}</p>
        <p><small>${bookmark.date}</small></p>
    `;
    bookmarkList.appendChild(bookmarkItem);
    bookmarkItem.addEventListener('click', handleBookmarkClick);
}

function handleBookmarkClick(event) {
    const bookmarkItem = event.currentTarget;
    const title = bookmarkItem.dataset.title;
    const url = bookmarkItem.dataset.url;
    const explanation = bookmarkItem.dataset.explanation;
    const date = bookmarkItem.dataset.date;

    console.log('Bookmark item clicked!');
    console.log('データ:', { title, url, explanation, date });

    // ブックマークの内容を表示
    document.getElementById('apod-title').textContent = title;
    document.getElementById('apod-image').src = url;
    document.getElementById('apod-explanation').textContent = explanation;
    document.getElementById('apod-date').textContent = date;
}



// ローカルストレージからブックマークを読み込み、表示する関数
function loadBookmarks() {
    const bookmarkList = document.getElementById('bookmark-list');
    bookmarkList.innerHTML = ''; // 既存の内容をクリア
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('apod-')) { // keyがnullでないことを確認
            const bookmark = JSON.parse(localStorage.getItem(key));
            if (bookmark) { // bookmarkがnullでないことを確認
                addBookmarkToList(bookmark);
            }
        }
    }
}

