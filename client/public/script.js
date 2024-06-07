document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");
  const registerForm = document.querySelector("#registerForm");
  const wrapper = document.querySelector(".wrapper");
  const errorSubmit = document.querySelector("#errorSubmit");
  const policy = document.querySelector("#policy");
  const policyError = document.querySelector("#isChecked");
  const logOut = document.querySelector("#logoutBtn");
  const incrementButton = document.querySelector("#increment");
  const decrementButton = document.querySelector("#decrement");
  const quantityInput = document.querySelector("#quantity");
  function contador(s) {
    document.querySelector("#contador").innerHTML = s;
    if (s == 0) window.location.href = "index.html";
    setTimeout(function () {
      contador(s - 1);
    }, 1000);
  }
  if (incrementButton) {
    console.log(incrementButton);
    incrementButton.addEventListener("click", (e) => {
      e.preventDefault();
      quantityInput.value = parseInt(quantityInput.value) + 1;
    });
  }
  if (decrementButton) {
    decrementButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(parseInt(quantityInput.value) - 1 >= 1);
      if (parseInt(quantityInput.value) - 1 >= 1)
        quantityInput.value = parseInt(quantityInput.value) - 1;
      else quantityInput.value = 1;
      console.log(quantityInput.value);
      console.log(typeof quantityInput.value);
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!policy.checked) {
        policyError.classList.add("error");
        policyError.innerHTML =
          "<i class='bx bx-info-circle' ></i>Se debe aceptar la politica de privacidad.";
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

        const result = await response.json();
        if (response.ok) {
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
