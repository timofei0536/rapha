import "./Chart.scss";
import Image from "next/image";

const DEFAULT_TITLE = "Organizational Chart";
const DEFAULT_DATA = {
    name: "Mr. Samuel Okoro",
    title: "Chief Operating Officer",
    image: { src: "/images/about/chart/avatar1.png", alt: "Mr. Samuel Okoro" },
    children: [
        {
            name: "Dr. Grace Ndlovu",
            title: "Chief Executive Officer",
            image: { src: "/images/about/chart/avatar2.png", alt: "Dr. Grace Ndlovu" },
            children: [
                {
                    name: "Dr. Amina Yusuf",
                    title: "Chief Medical Officer",
                    image: { src: "/images/about/chart/avatar3.png", alt: "Dr. Amina Yusuf" },
                    children: [],
                },
                {
                    name: "Dr. Peter Banda",
                    title: "Head of Internal Medicine",
                    image: { src: "/images/about/chart/avatar4.png", alt: "Dr. Peter Banda" },
                    children: [
                        {
                            name: "Dr. Faith Kamau",
                            title: "Head of Surgery",
                            image: { src: "/images/about/chart/avatar7.png", alt: "Dr. Faith Kamau" },
                            children: [],
                        },
                        {
                            name: "Dr. Ruth Ssebagala",
                            title: "Head of Obstetrics & Gynaecology",
                            image: { src: "/images/about/chart/avatar8.png", alt: "Dr. Ruth Ssebagala" },
                            children: [],
                        },
                    ],
                },
                {
                    name: "Mr. Samuel Okoro",
                    title: "Chief Operating Officer",
                    image: { src: "/images/about/chart/avatar5.png", alt: "Mr. Samuel Okoro" },
                    children: [],
                },
                {
                    name: "Ms. Mercy Toure",
                    title: "Director of Nursing",
                    image: { src: "/images/about/chart/avatar6.png", alt: "Ms. Mercy Toure" },
                    children: [
                        {
                            name: "Mr. Joseph Karanja",
                            title: "Hospital Administrator",
                            image: { src: "/images/about/chart/avatar9.png", alt: "Mr. Joseph Karanja" },
                            children: [],
                        },
                    ],
                },
            ],
        },
    ],
};

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

export default function Chart({ title = DEFAULT_TITLE, data = DEFAULT_DATA }) {
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
