export default function ProfileImage({ url, style, isAvatar }) {
  return url && url !== "" ? (
    <img
      src={url}
      alt="image"
      className="img-fluid image-fluid-custom-message"
      style={style ? style : { borderRadius: "40px", width: "100%", height: "100%" }}
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
