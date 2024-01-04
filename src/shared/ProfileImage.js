export default function ProfileImage({ url, style, isAvatar }) {
  return url && url !== "" ? (
    <img
      src={url}
      alt="image"
      className="img-fluid image-fluid-custom-message"
      style={style ? { ...style, objectFit: "contain", backgroundColor: "white" } : { borderRadius: "40px", width: "90%", height: "90%", objectFit: "contain", backgroundColor: "white" }}
    />
  ) : (
    <img
      src="/images/profile/default-profile.png"
      alt="profile-img"
      className="img-fluid"
      style={style ? style : { borderRadius: "30px" }}
    />
  );
}
