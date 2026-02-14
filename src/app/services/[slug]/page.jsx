// import Link from "next/link";
// import PageScreen from "@/components/PageScreen/PageScreen";
// import Btn from "@/components/ui/Btn/Btn";
// import { ArrowLeft } from "@/components/ui/icons";
// import Services from "@/components/Services/Services";
// import News from "@/components/News/News";

// function formatServiceTitle(slug) {
//     return slug
//         .split("-")
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(" ");
// }

// export async function generateMetadata({ params }) {
//     const { slug } = await params;
//     const title = formatServiceTitle(slug);
//     return { title };
// }

// export default async function ServicePage({ params }) {
//     const { slug } = await params;
//     const title = formatServiceTitle(slug);
//     return (
//         <main>
//             <PageScreen
//                 title={title}
//                 img={{ src: "/images/services-screen.png", alt: title, width: 1920, height: 1070 }}
//                 btn={
//                     <Link href="/services">
//                         <Btn text="Back to services" icon={ArrowLeft} iconPosition="left" className="btn--blue-l" />
//                     </Link>
//                 }
//             />
//             <Services />
//             <News />
//         </main>
//     );
// }
