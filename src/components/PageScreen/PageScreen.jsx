import "./PageScreen.scss";

export default function PageScreen({ children }) {
    return (
        <section className="page-screen">
            <div className="center-wrap">
                {children}
            </div>
        </section>
    );
}