/**
 * Chart component default props.
 */
export const ChartDefaults = {
  title: "Organizational Chart",
  data: {
    name: "Mr. Samuel Okoro",
    title: "Chief Operating Officer",
    image: { src: "/images/about/chart/avatar1.png", alt: "Mr. Samuel Okoro" },
    children: [
      {
        name: "Dr. Grace Ndlovu",
        title: "Chief Executive Officer",
        image: { src: "/images/about/chart/avatar2.png", alt: "Dr. Grace Ndlovu" },
        children: [
          { name: "Dr. Amina Yusuf", title: "Chief Medical Officer", image: { src: "/images/about/chart/avatar3.png", alt: "Dr. Amina Yusuf" }, children: [] },
          {
            name: "Dr. Peter Banda",
            title: "Head of Internal Medicine",
            image: { src: "/images/about/chart/avatar4.png", alt: "Dr. Peter Banda" },
            children: [
              { name: "Dr. Faith Kamau", title: "Head of Surgery", image: { src: "/images/about/chart/avatar7.png", alt: "Dr. Faith Kamau" }, children: [] },
              { name: "Dr. Ruth Ssebagala", title: "Head of Obstetrics & Gynaecology", image: { src: "/images/about/chart/avatar8.png", alt: "Dr. Ruth Ssebagala" }, children: [] },
            ],
          },
          { name: "Mr. Samuel Okoro", title: "Chief Operating Officer", image: { src: "/images/about/chart/avatar5.png", alt: "Mr. Samuel Okoro" }, children: [] },
          {
            name: "Ms. Mercy Toure",
            title: "Director of Nursing",
            image: { src: "/images/about/chart/avatar6.png", alt: "Ms. Mercy Toure" },
            children: [{ name: "Mr. Joseph Karanja", title: "Hospital Administrator", image: { src: "/images/about/chart/avatar9.png", alt: "Mr. Joseph Karanja" }, children: [] }],
          },
        ],
      },
    ],
  },
};
