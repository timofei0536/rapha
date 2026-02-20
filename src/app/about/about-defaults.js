/**
 * About page component defaults.
 */
export const AboutScreenDefaults = {
  subtitle: "Polyclinc",
  title: "The El-Rapha Polyclinic is a modern medical-surgical facility, equipped with high-end technical equipment and staffed by experienced practitioners with recognized expertise.",
  content: "It was inaugurated on May 27, 2000 by His Excellency <b>El Hadj Omar BONGO ONDIMBA</b> and started its activities the same year. Our ambition is to provide you with a <b>welcoming facility</b> while ensuring <b>fast and high-quality care.</b>",
  image: { src: "/images/about/about-screen.png", alt: "image" },
};

export const AboutDefaults = {
  gm: {
    image: { src: "/images/about/manager.png", alt: "Curtis Andjoua Opra" },
    title: "Curtis Andjoua Opra",
    position: "General Manager",
  },
  title: "The word of\nGeneral manager",
  items: [
    { content: "<p><b>Welcome</b> to the <b>EL-RAPHA Polyclinic</b>, where the Director, the medical team, and all the staff are pleased to welcome you. While thanking you for your trust, they assure you of their dedication to providing you with the <b>best possible care</b>.</p>", image: { src: "/images/about/about1.png", alt: "image" }, layout: "content-image" },
    { content: "<p>Our mission has always been to ensure <b>quality</b> <b>and safe care</b> in various fields of general and specialized medicine, respecting our founding values: <b>a welcoming and friendly atmosphere</b>, <b>respect and compassion</b>, <b>sharing and fairness</b>. The primary purpose of any healthcare facility, whether public or private, is, and must remain, the quality of care and the safety of patients.</p>", image: { src: "/images/about/about2.png", alt: "image" }, layout: "content-image" },
    { content: "<p>The EL-RAPHA Polyclinic is constantly evolving to provide its patients with the <b>highest quality of care and safety</b> tailored to their needs and expectations. The Polyclinic's staff, regardless of their role, contributes to this <b>pursuit of excellence</b>, guiding their work to provide you with the best possible care and make your stay as comfortable as possible.</p><p><b>We thank you for your trust over the past 10 years; it is an honor and a responsibility we all share.</b></p>", image: { src: "/images/about/about3.png", alt: "image" }, layout: "image-content" },
  ],
};

export const StructureDefaults = {
  title: "The Structure",
  tabs: [
    { label: "Ground Floor", content: `<ul>
<li>Endoscopy Unit</li>
<li>Outpatient consultation</li>
<li>Emergency Department</li>
<li>Main Hall</li>
<li>Internal Medicine and Dialysis Department</li>
<li>Cafeteria</li>
<li>Admissions Office</li>
<li>Box</li>
</ul>` },
    { label: "First Floor", content: `<ul>
<li>Intensive Care Unit</li>
<li>Neonatal Unit</li>
<li>Recovery Room</li>
<li>Delivery room</li>
<li>Hospitalization Chambers Maternity</li>
<li>Conference room</li>
<li>Operating rooms</li>
<li>Obstetrics Unit</li>
<li>Visceral Unit</li>
<li>Orthopedic and Trauma Block</li>
<li>Otolaryngology and Ophthalmology Unit</li>
<li>Gynecology, Obstetrics and Maternity Services</li>
</ul>` },
    { label: "Second Floor", content: `<ul>
<li>General Management (Administrative Offices)</li>
<li>Surgical inpatient rooms</li>
<li>Pediatric Department (Annex Building)</li>
<li>Conference room</li>
</ul>` },
    { label: "Level R - I", content: `<ul>
<li>Medical imaging department
<ul>
<li>Ultrasound</li>
<li>X-ray</li>
<li>CT scan</li>
<li>MRI</li>
<li>Mammography</li>
</ul>
</li>
<li>Medical Analysis Laboratory
<ul>
<li>Bacteriology</li>
<li>Hematology</li>
<li>Biochemistry</li>
</ul>
</li>
<li>Pharmacy</li>
<li>Kitchen</li>
<li>Laundry</li>
</ul>` },
  ],
};

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

export const NewsDefaults = {
  title: "News",
  items: [
    { image: { src: "/images/news1.png", alt: "news-image" }, title: "Lorem ipsum dolor", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
    { image: { src: "/images/news2.png", alt: "news-image" }, title: "Lorem ipsum dolor", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
    { image: { src: "/images/news3.png", alt: "news-image" }, title: "Lorem ipsum dolor", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
  ],
};
