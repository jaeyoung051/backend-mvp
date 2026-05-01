import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "./SignupPage.css";

interface SignupForm {
  email: string;
  password: string;
  name: string;
}

interface SignupError {
  field: string;
  message: string;
}

export default function SignupPage() {
  const [form, setForm] = useState<SignupForm>({
    email: "",
    password: "",
    name: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<SignupError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: SignupError[] = [];

    if (!form.email.trim()) {
      newErrors.push({ field: "email", message: "이메일을 입력해주세요." });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.push({ field: "email", message: "올바른 이메일 형식이 아닙니다." });
    }

    if (!form.password) {
      newErrors.push({ field: "password", message: "비밀번호를 입력해주세요." });
    } else if (form.password.length < 4 || form.password.length > 20) {
      newErrors.push({ field: "password", message: "비밀번호는 4자 이상 20자 이하여야 합니다." });
    }

    if (!form.name.trim()) {
      newErrors.push({ field: "name", message: "이름을 입력해주세요." });
    } else if (form.name.length > 50) {
      newErrors.push({ field: "name", message: "이름은 50자 이하여야 합니다." });
    }

    if (form.password !== confirmPassword) {
      newErrors.push({ field: "confirmPassword", message: "비밀번호가 일치하지 않습니다." });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      await api.post("/api/users/signup", {
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
      });

      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      navigate("/login");
    } catch (err: unknown) {
      console.error(err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || "회원가입에 실패했습니다.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getError = (field: string) => errors.find((e) => e.field === field)?.message;

  const handleChange = (field: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => prev.filter((e) => e.field !== field));
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Join</h1>
          <p>새 계정을 만들어 게시판을 이용하세요</p>
        </div>

        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="이메일을 입력하세요"
              autoComplete="email"
            />
            {getError("email") && <span className="error-text">{getError("email")}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="이름을 입력하세요"
              autoComplete="name"
            />
            {getError("name") && <span className="error-text">{getError("name")}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="4자 이상 20자 이하"
              autoComplete="new-password"
            />
            {getError("password") && <span className="error-text">{getError("password")}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => prev.filter((e) => e.field !== "confirmPassword"));
              }}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
            />
            {getError("confirmPassword") && <span className="error-text">{getError("confirmPassword")}</span>}
          </div>

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? "회원가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="signup-footer">
          <span>이미 계정이 있으신가요? </span>
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}