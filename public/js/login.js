$(document).ready(() => {
 // loginRequest();
});
function loginRequest() {
  $("#btnSubmit").on("click", (e) => {
    e.preventDefault();
    const { status, information } = validateInput();
    if (status) {
      $("form").submit();
    }
  });
}
function validateInput() {
  let status = false;
  const email = $("#floatingInput");
  const password = $("#floatingPassword");

  const emailVal = email.val();
  const passwordVal = password.val();
  if (emailVal != "") {
    if (validateEmail(emailVal)) {
      status = true;
      removeWarning(email);
    } else {
      status = false;
      setWarningText(email, "Email is not trust format");
    }
  } else {
    status = false;
    setWarningText(email, "Email can not be empty");
  }
  if (passwordVal != "") {
    status = true;
    removeWarning(password);
  } else {
    status = false;
    setWarningText(password, "Password can not be empty");
  }

  if (status) {
    return {
      status: true,
      information: { email: emailVal, passwordVal: passwordVal },
    };
  }
  return { status: false, information: { emailVal: "", passwordVal: "" } };
}

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
