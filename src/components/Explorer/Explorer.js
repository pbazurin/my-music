import { useCallback, useEffect, useState } from "react";
import DB from "./db.json";
import "./Explorer.css";

function Explorer(props) {
  const [db, setDB] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [currentPath, setCurrentPath] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [explorerItems, setExplorerItems] = useState([]);
  const historyVideoIdPrefix = "?v=";

  const toggleSearchInputFocus = (isFocus) => {
    setIsSearchActive(searchText || isFocus);
  };
  const searchByText = (text) => {
    setSearchText(text);

    if (!text) {
      goToItem(selectedItemId);
      return;
    }

    const matchedItems = [];
    db.forEach((item) => {
      if (text && item.name.toUpperCase().indexOf(text.toUpperCase()) === -1) {
        return;
      }

      matchedItems.push(item);
    });

    setExplorerItems(matchedItems);
  };
  const goToItem = (itemId) => {
    const item = db.find((item) => item.yId === itemId);
    const currentPath = item ? item.path.split("/").slice(0, -1).join("/") : "";

    goToFolder(currentPath);

    if (!item) {
      return;
    }

    setSelectedItemId(itemId);
    props.videoSelected(itemId);
  };
  const goToFolder = (path) => {
    const explorerItems = [];

    if (path) {
      explorerItems.push({
        name: "...",
        isFolder: true,
        path: path.split("/").slice(0, -1).join("/"),
      });
    }

    db.forEach((dbItem) => {
      if (path && dbItem.path.indexOf(path) === -1) {
        return;
      }

      const shiftedPath = path
        ? dbItem.path.replace(path + "/", "")
        : dbItem.path;

      if (shiftedPath.indexOf("/") === -1) {
        explorerItems.push(dbItem);
        return;
      }

      const folderName = shiftedPath.split("/")[0];
      const isFolderAlreadyAdded = !!explorerItems.find(
        (item) => item.name === folderName
      );

      if (isFolderAlreadyAdded) {
        return;
      }

      explorerItems.push({
        name: folderName,
        isFolder: true,
        path: path ? path + "/" + folderName : folderName,
      });
    });

    setCurrentPath(path);
    setExplorerItems(explorerItems);
  };
  const itemClick = (item) => {
    if (item.isFolder) {
      goToFolder(item.path);
    } else {
      window.history.pushState(null, "", historyVideoIdPrefix + item.yId);
      setSelectedItemId(item.yId);
      props.videoSelected(item.yId);
    }
  };
  const selectVideoIdFromUrl = useCallback(() => {
    if (!db) {
      return;
    }

    const prefixIndex = document.URL.indexOf(historyVideoIdPrefix);

    const itemId =
      prefixIndex === -1
        ? null
        : document.URL.slice(prefixIndex + historyVideoIdPrefix.length);

    if (itemId) {
      goToItem(itemId);
    } else {
      goToFolder();
    }
  }, [db]);

  useEffect(() => {
    const database = DB;
    database.forEach((dbItem) => {
      dbItem.name = dbItem.path.split("/").pop();
      dbItem.isFolder = false;
    });

    database.sort(function (a, b) {
      return a.path.toUpperCase() > b.path.toUpperCase() ? 1 : -1;
    });

    setDB(database);
  }, []);

  useEffect(() => {
    window.onpopstate = selectVideoIdFromUrl.bind(this);
  }, [selectVideoIdFromUrl]);

  useEffect(() => {
    selectVideoIdFromUrl();
  }, [selectVideoIdFromUrl]);

  return (
    <div className="explorer">
      <div className="explorer_toolbar">
        <div className="explorer_toolbar_currPath">{currentPath}</div>
        <div className="explorer_toolbar_search">
          <input
            type="text"
            className={
              isSearchActive
                ? "explorer_toolbar_search_text explorer_toolbar_search_text--active"
                : "explorer_toolbar_search_text"
            }
            onFocus={() => toggleSearchInputFocus(true)}
            onBlur={() => toggleSearchInputFocus(false)}
            onInput={(e) => searchByText(e.target.value)}
          />
          <i className="icon explorer_toolbar_search_icon"></i>
        </div>
      </div>

      <div className="explorer_content">
        {explorerItems?.map((item) => (
          <div
            key={item.name}
            className={
              item.yId === selectedItemId
                ? "explorer_content_item explorer_content_item--active"
                : "explorer_content_item"
            }
            onClick={() => itemClick(item)}
          >
            <i
              className={
                item.isFolder
                  ? "icon explorer_content_item_icon folderIcon"
                  : "icon explorer_content_item_icon musicItemIcon"
              }
            ></i>
            <span className="explorer_content_item_text">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explorer;
