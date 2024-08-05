const apiKey = '27tRhbmdC3wHCHybqKQ4vFy0Z0Rq85oX4EEeeuEK'; // 取得したNASAのAPIキーを使用

// ランダムな画像を取得する関数
function init() {
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

            // 現在表示されている要素をブックマークするためのデータを保存
            document.getElementById('bookmark-apod').dataset.bookmarkData = JSON.stringify({
                date: data.date,
                title: data.title,
                url: data.url,
                explanation: data.explanation
            });

            // ページ読み込み時に既存のブックマークを表示
            loadBookmarks();
        })
        .catch(error => console.error('NASA APOD APIからのデータ取得エラー:', error));
}

init();

const Reloadbtn = document.getElementById("reloadingbtn");
Reloadbtn.addEventListener("click", () => {
    init();
});

// ブックマークボタンのイベントリスナーを設定
document.getElementById('bookmark-apod').addEventListener('click', () => {
    const bookmarkedData = JSON.parse(document.getElementById('bookmark-apod').dataset.bookmarkData);
    localStorage.setItem(`apod-${bookmarkedData.date}`, JSON.stringify(bookmarkedData));
    alert('ブックマークされました!');
    addBookmarkToList(bookmarkedData);
});

document.getElementById("bookmark-delete").addEventListener("click", () => {
    localStorage.clear();
    alert("全てのブックマークを削除しました");
    loadBookmarks();
});

// ブックマークに追加する関数
function addBookmarkToList(bookmark) {
    console.log('ブックマークを追加:', bookmark);
    const bookmarkList = document.getElementById('bookmark-list');
    const bookmarkItem = document.createElement('div');
    bookmarkItem.classList.add('bookmark-item');
    bookmarkItem.innerHTML = `
        <h3 id=data-title>${bookmark.title}</h3>
        <img src="${bookmark.url}" alt="${bookmark.title}" style="width: 100px;" id="data-url">
        <p id="data-explanation">${bookmark.explanation}</p>
        <p id=data-date><small>${bookmark.date}</small></p>
    `;
    bookmarkList.appendChild(bookmarkItem);
    bookmarkItem.addEventListener('click', handleBookmarkClick);
}

//ブックマークからメインの画面に移動させる関数
function handleBookmarkClick(event) {
    const bookmarkItem = event.currentTarget;
    console.log('Bookmark item clicked:', bookmarkItem);

    // クリックされた要素の id="data-date" を持つ要素を取得
    const keyElement = bookmarkItem.querySelector('#data-date');
    let key = keyElement ? keyElement.textContent.trim() : '';
    key = "apod-" + key;
    console.log('Key:', key);

    // LocalStorage からデータを取得
    const bookmarkData = JSON.parse(localStorage.getItem(key));
    console.log('Bookmark data:', bookmarkData);
    if (bookmarkData) {
        const title = bookmarkData.title || 'タイトルがありません';
        const url = bookmarkData.url || '';
        const explanation = bookmarkData.explanation || '説明がありません';
        const date = bookmarkData.date || '日付がありません';

        console.log('データ:', { title, url, explanation, date });

        // ブックマークの内容を表示
        document.getElementById('apod-title').textContent = title;
        document.getElementById('apod-image').src = url;
        document.getElementById('apod-explanation').textContent = explanation;
    } else {
        console.log('LocalStorageにブックマークデータが見つかりませんでした。');
    }
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

