// DevToolsページ：パネルを作成して登録する
// このファイルがDevToolsのコンテキストで実行され、カスタムパネルを追加する

chrome.devtools.panels.create(
  "Net2Sheet", // パネルのタブ名
  "icon16.png", // パネルのアイコン（オプション）
  "panel.html", // パネルのHTMLファイル
  function (panel) {
    // パネルが作成された後のコールバック
    console.log("Net2Sheet panel created successfully");

    // パネルが表示されたときの処理（オプション）
    panel.onShown.addListener(function (panelWindow) {
      console.log("Net2Sheet panel shown");
      // panelWindow は panel.html の window オブジェクト
    });

    // パネルが非表示になったときの処理（オプション）
    panel.onHidden.addListener(function () {
      console.log("Net2Sheet panel hidden");
    });
  }
);
