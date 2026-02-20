import "./Chart.scss";
import Image from "next/image";

function ChartNode({ node, siblingIndex }) {
    const hasChildren = node.children && node.children.length > 0;
    const nodeClass =
        "chart__node" +
        (siblingIndex === undefined
            ? " chart__node--right"
            : hasChildren
                ? siblingIndex <= 1
                    ? " chart__node--right"
                    : " chart__node--left"
                : "");

    return (
        <div className="chart__branch">
            <div className={nodeClass}>
                <div className="chart__node-avatar">
                    <div className="img-wrap" style={{ aspectRatio: "1/1" }}>
                      <Image
                        src={node.image.src}
                        alt={node.image.alt}
                        fill
                      />
                    </div>
                </div>
                <div className="chart__node-text">
                    <h3 className="chart__node-name">{node.name}</h3>
                    <div className="chart__node-title">{node.title}</div>
                </div>
            </div>
            {hasChildren && (
                <>
                    {node.children.length > 1 && (
                        <div className="chart__connector chart__connector--down" />
                    )}
                    <div className="chart__children">
                        {node.children.length > 1 && (
                            <div className="chart__connector chart__connector--horizontal" />
                        )}
                        <div className="chart__children-list">
                            {node.children.map((child, i) => (
                                <div key={i} className="chart__child-wrap">
                                    <div className="chart__connector chart__connector--to-child" />
                                    <ChartNode node={child} siblingIndex={i} />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function Chart(props) {
    const { title, data } = props;
    if (!data) return null;
    return (
        <section className="chart">
            <div className="center-wrap">
                <div className="chart__wrap white-header">
                    <div className="center-wrap center-wrap--small">
                <h2 className="chart__title simple-title">{title}</h2>
                <div className="chart__tree">
                    <ChartNode node={data} />
                </div>
                </div>
                </div>
            </div>
        </section>
    );
}
