import "./Chart.scss";
import Image from "next/image";

const chartData = {
    name: "Mr. Samuel Okoro",
    title: "Chief Operating Officer",
    avatar: "/images/about/chart/avatar1.png",
    children: [
        {
            name: "Dr. Grace Ndlovu",
            title: "Chief Executive Officer",
            avatar: "/images/about/chart/avatar2.png",
            children: [
                {
                    name: "Dr. Amina Yusuf",
                    title: "Chief Medical Officer",
                    avatar: "/images/about/chart/avatar3.png",
                    children: [
                        {
                            name: "Dr. Faith Kamau",
                            title: "Head of Surgery",
                            avatar: "/images/about/chart/avatar7.png",
                            children: [],
                        },
                        {
                            name: "Dr. Ruth Ssebagala",
                            title: "Head of Obstetrics & Gynaecology",
                            avatar: "/images/about/chart/avatar8.png",
                            children: [],
                        },
                    ],
                },
                {
                    name: "Dr. Peter Banda",
                    title: "Head of Internal Medicine",
                    avatar: "/images/about/chart/avatar4.png",
                    children: [],
                },
                {
                    name: "Mr. Samuel Okoro",
                    title: "Chief Operating Officer",
                    avatar: "/images/about/chart/avatar5.png",
                    children: [],
                },
                {
                    name: "Ms. Mercy Toure",
                    title: "Director of Nursing",
                    avatar: "/images/about/chart/avatar6.png",
                    children: [
                        {
                            name: "Mr. Joseph Karanja",
                            title: "Hospital Administrator",
                            avatar: "/images/about/chart/avatar9.png",
                            children: [],
                        },
                    ],
                },
            ],
        },
    ],
};

function ChartNode({ node }) {
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="chart__branch">
            <div className="chart__node">
                <div className="chart__node-avatar">
                    <div className="img-wrap" style={{ aspectRatio: "1/1" }}>
                      <Image
                        src={node.avatar}
                        alt={node.name}
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
                    <div className="chart__connector chart__connector--down" />
                    <div className="chart__children">
                        <div className="chart__connector chart__connector--horizontal" />
                        <div className="chart__children-list">
                            {node.children.map((child, i) => (
                                <div key={i} className="chart__child-wrap">
                                    <div className="chart__connector chart__connector--to-child" />
                                    <ChartNode node={child} />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function Chart() {
    return (
        <section className="chart">
            <div className="center-wrap">
                <div className="chart__wrap">
                    <div className="center-wrap center-wrap--small">
                <h2 className="chart__title simple-title">Organizational Chart</h2>
                <div className="chart__tree">
                    <ChartNode node={chartData} />
                </div>
                </div>
                </div>
            </div>
        </section>
    );
}
