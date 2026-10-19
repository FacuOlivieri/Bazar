// Underlined tab strip with a tabular count per tab: «Todos (10)».
export function Tabs({ label, tabs, activeKey, counts, onSelect }) {
  return (
    <div role="tablist" aria-label={label} className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={tab.key === activeKey}
          className={tab.key === activeKey ? 'tab is-on' : 'tab'}
          onClick={() => onSelect(tab.key)}
        >
          {tab.label} ({counts[tab.key]})
        </button>
      ))}
    </div>
  );
}
