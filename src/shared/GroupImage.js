export default function GroupImage({ url, style }) {
    return url && url !== "" ? (
        <img
            src={url}
            alt="group-logo"
            className="img-fluid"
            style={style ?? {}}
/>
    ) : (
    <img
        src="/images/icons/group-logo.svg"
        alt="group-logo"
        className="img-fluid image-fluid-custom-message"
        style={style ?? {}}
    />
);
}
