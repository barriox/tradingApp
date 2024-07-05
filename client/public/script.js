document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");
  const registerForm = document.querySelector("#registerForm");
  const wrapper = document.querySelector(".wrapper");
  const errorSubmit = document.querySelector(".error-submit");
  const policy = document.querySelector("#policy");
  const policyError = document.querySelector("#isChecked");
  const logOut = document.querySelector("#logoutBtn");
  function contador(s) {
    document.querySelector("#contador").innerHTML = s;
    if (s == 0) window.location.href = "index.html";
    setTimeout(function () {
      contador(s - 1);
    }, 1000);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!policy.checked) {
        errorSubmit.classList.add("display-error");
        errorSubmit.innerHTML =
          "<i class='bx bx-info-circle display-error' ></i>Se debe aceptar la politica de privacidad.";
        return;
      }
      policyError.innerHTML = "";
      const form = e.target;
      const formData = new FormData(form);
      const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      };
      try {
        const response = await fetch("/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
          wrapper.innerHTML = "";
          wrapper.classList.add("success");
          wrapper.innerHTML = `${result.message} <label id="contador"></label>`;
          contador(10);
        } else {
          errorSubmit.classList.add("display-error");
          errorSubmit.innerHTML = `
              <i class='bx bx-info-circle' ></i>
              ${result.message}
              `;
        }
      } catch (error) {
        console.error("Error:", error);
        errorSubmit.innerHTML = `
              <i class='bx bx-info-circle' ></i>
              ${result.message}
              `;
      }
    });
  }
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const data = {
        email: formData.get("email"),
        password: formData.get("password"),
      };
      try {
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          errorSubmit.classList.add("display-error");
          errorSubmit.innerHTML = `
              <i class='bx bx-info-circle' ></i>
              ${response.error}
              `;
        }
        const result = await response.json();
        if (response.ok) {
          console.log(response);
          await fetch(`/auth/${result.username}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          window.location.href = `/auth/${result.username}`;
        } else {
          errorSubmit.innerHTML = `
              <i class='bx bx-info-circle' ></i>
              ${result.error}
              `;
        }
      } catch (error) {
        console.error("Error:", error);
        errorSubmit.innerHTML = `
              <i class='bx bx-info-circle' ></i>
              ${result.message}
              `;
      }
    });
  }
  if (logOut) {
    logOut.addEventListener("click", async (e) => {
      await fetch("/auth/logout", { method: "GET" })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/";
          } else {
            console.error("Logout failed");
          }
        })
        .catch((error) => {
          console.error("Error logout:", error);
        });
    });
  }
});
