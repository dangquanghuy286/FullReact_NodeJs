export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Lỗi khi gọi profile", error);
    return res.status(500).json({
      message: "Lỗi hệ thống  !",
    });
  }
};
