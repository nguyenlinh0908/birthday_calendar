$(document).ready(() => {
  agreeStatements();
  startForm();
});
function agreeStatements() {
  $('input[type="checkbox"]').click(function () {
    if ($(this).prop("checked") == true) {
      console.log("Checkbox is checked.");
      $("#btnSubmit").prop("disabled", false);
    } else if ($(this).prop("checked") == false) {
      console.log("Checkbox is unchecked.");
      $("#btnSubmit").prop("disabled", true);
    }
  });
}

function startForm() {
  $("form").on("submit", (e) => {
    e.preventDefault();
    const { status, info } = checkValidate();
    if (status) {
      const infoRegister = new FormData();
      infoRegister.append("name", info.name);
      infoRegister.append("email", info.email);
      infoRegister.append("password", info.password);
      fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": " application/json",
        },
        body: JSON.stringify({
          name: info.name,
          email: info.email,
          password: info.password,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          const account = result.accountCreated;
          console.log(account._id);
          if (account._id != "") {
            setMessage({
              title: "Birthday calendar",
              content: "Create account success",
              bg: "bg-success",
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });
}

const checkValidate = () => {
  let status = true;
  const fullName = $("#full_name");
  const email = $("#email");
  const pass = $("#password");
  const re_pass = $("#re_password");

  if (fullName.val() == "") {
    status = false;
    setWarningText(fullName, "Full name can not be empty");
  } else {
    status = true;
    removeWarning(fullName);
  }
  if (email.val() == "") {
    status = false;
    setWarningText(email, "Email can not be empty");
  } else if (!validateEmail(email.val())) {
    status = false;
    setWarningText(email, "Email is not trust format");
  } else {
    status = true;
    removeWarning(email);
  }
  if (pass.val() == "") {
    status = false;
    setWarningText(pass, "Password can not be empty");
  } else {
    status = true;
    removeWarning(pass);
  }
  if (re_pass.val() == "") {
    status = false;
    setWarningText(re_pass, "Repeat Password can not be empty");
  } else if (pass.val().localeCompare(re_pass.val()) != 0) {
    status = false;
    setWarningText(re_pass, "Password with Repeat password, no match");
  } else {
    status = true;
    removeWarning(re_pass);
  }

  if (status == false) {
    return { status: false, info: {} };
  } else {
    return {
      status: true,
      info: { name: fullName.val(), email: email.val(), password: pass.val() },
    };
  }
};
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const setWarningText = (target, message) => {
  target.addClass("is-invalid");
  target.parent().children(":last").html(message);
};

const removeWarning = (target) => {
  target.removeClass("is-invalid");
};
function setMessage({ title, content, bg }) {
  $(".toast").toast({
    animation: true,
    autohide: true,
    delay: 5000,
  });
  $("#toast_title").html(title);
  $(".toast-body").html(content);
  $(".toast").addClass(bg);
  $(".toast").toast("show");
}
