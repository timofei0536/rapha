import "./PageScreen.scss";

export default function PageScreen({ children, className = "" }) {
    return (
        <section className={`page-screen white-header ${className}`.trim()}>
            <div className="center-wrap">
                {children}
            </div>
        </section>
    );
}