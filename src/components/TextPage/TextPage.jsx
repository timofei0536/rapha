import "./TextPage.scss";

export default function TextPage({ title, content }) {
  const isHtml = typeof content === "string";
  return (
    <section className="text-page">
      <div className="center-wrap text-page__wrap">
        <div className="text-page__page center-wrap center-wrap--small">
          {title && <h1 className="text-page__title simple-title">{title}</h1>}
          {content &&
            (isHtml ? (
              <div
                className="text-page__content content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="text-page__content content">{content}</div>
            ))}
        </div>
      </div>
    </section>
  );
}
