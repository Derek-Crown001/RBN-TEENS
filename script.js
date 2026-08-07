const form = document.getElementById("rbnForm");
const sections = Array.from(document.querySelectorAll(".form-section"));

const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const submitBtn = document.getElementById("submitBtn");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");

const success = document.getElementById("success");
const successName = document.getElementById("successName");
const newRegistration = document.getElementById("newRegistration");

let currentSection = 0;


/* =====================================================
   UPDATE FORM DISPLAY
   ===================================================== */

function updateView() {
    sections.forEach(function(section, index) {
        section.classList.toggle(
            "active",
            index === currentSection
        );
    });

    const percent = Math.round(
        ((currentSection + 1) / sections.length) * 100
    );

    if (progressBar) {
        progressBar.style.width = percent + "%";
    }

    if (progressText) {
        progressText.textContent =
            "Section " +
            (currentSection + 1) +
            " of " +
            sections.length;
    }

    if (progressPercent) {
        progressPercent.textContent = percent + "%";
    }

    if (backBtn) {
        backBtn.classList.toggle(
            "hidden",
            currentSection === 0
        );
    }

    if (nextBtn) {
        nextBtn.classList.toggle(
            "hidden",
            currentSection === sections.length - 1
        );
    }

    if (submitBtn) {
        submitBtn.classList.toggle(
            "hidden",
            currentSection !== sections.length - 1
        );
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   SHOW FIELD ERROR
   ===================================================== */

function showFieldError(element, message) {

    element.classList.add("invalid");

    const field = element.closest(".field");

    if (field) {

        const error =
            field.querySelector(".error");

        if (error) {
            error.textContent = message;
        }
    }
}


/* =====================================================
   CLEAR FIELD ERROR
   ===================================================== */

function clearFieldError(element) {

    element.classList.remove("invalid");

    const field = element.closest(".field");

    if (field) {

        const error =
            field.querySelector(".error");

        if (error) {
            error.textContent = "";
        }
    }
}


/* =====================================================
   VALIDATE CURRENT SECTION
   ===================================================== */

function validateSection(index) {

    const section = sections[index];

    let valid = true;


    /* -----------------------------------------------
       REQUIRED INPUTS
       ----------------------------------------------- */

    const requiredFields =
        section.querySelectorAll(
            "input[required]:not([type='checkbox']), " +
            "select[required], " +
            "textarea[required]"
        );


    requiredFields.forEach(function(field) {

        if (!field.value.trim()) {

            showFieldError(
                field,
                "This field is required."
            );

            valid = false;

        } else {

            clearFieldError(field);
        }
    });


    /* -----------------------------------------------
       EMAIL VALIDATION
       ----------------------------------------------- */

    const emailFields =
        section.querySelectorAll(
            "input[type='email']"
        );


    emailFields.forEach(function(field) {

        const value =
            field.value.trim();

        if (
            value &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {

            showFieldError(
                field,
                "Please enter a valid email address."
            );

            valid = false;

        } else if (value) {

            clearFieldError(field);
        }
    });


    /* -----------------------------------------------
       PHONE NUMBER VALIDATION
       ----------------------------------------------- */

    const phoneFields =
        section.querySelectorAll(
            "input[type='tel']"
        );


    phoneFields.forEach(function(field) {

        const value =
            field.value.trim();

        if (
            value &&
            !/^[+0-9()\-\s]{7,20}$/.test(value)
        ) {

            showFieldError(
                field,
                "Please enter a valid phone/WhatsApp number."
            );

            valid = false;

        } else if (value) {

            clearFieldError(field);
        }
    });


    /* -----------------------------------------------
       CHECKBOX GROUP VALIDATION
       ----------------------------------------------- */

    const checkboxErrors =
        section.querySelectorAll(
            ".group-error"
        );


    checkboxErrors.forEach(function(errorElement) {

        const parent =
            errorElement.closest(".field");

        if (!parent) {
            return;
        }

        const checkboxes =
            parent.querySelectorAll(
                "input[type='checkbox']"
            );

        if (!checkboxes.length) {
            return;
        }

        const checked =
            Array.from(checkboxes).some(
                function(checkbox) {
                    return checkbox.checked;
                }
            );


        if (!checked) {

            errorElement.textContent =
                "Please select at least one option.";

            valid = false;

        } else {

            errorElement.textContent = "";
        }
    });


    /* -----------------------------------------------
       PARENT/GUARDIAN CONSENT
       ----------------------------------------------- */

    if (index === 4) {

        const consent =
            document.getElementById("consent");

        const consentError =
            document.getElementById(
                "consentError"
            );


        if (!consent.checked) {

            consentError.textContent =
                "Parent/Guardian consent is required.";

            valid = false;

        } else {

            consentError.textContent = "";
        }
    }


    /* -----------------------------------------------
       COMMUNITY GUIDELINES
       ----------------------------------------------- */

    if (index === 5) {

        const guidelines =
            document.getElementById(
                "guidelines"
            );

        const guidelinesError =
            document.getElementById(
                "guidelinesError"
            );


        if (!guidelines.checked) {

            guidelinesError.textContent =
                "You must agree to the community guidelines.";

            valid = false;

        } else {

            guidelinesError.textContent = "";
        }
    }


    /* -----------------------------------------------
       SCROLL TO FIRST ERROR
       ----------------------------------------------- */

    if (!valid) {

        const firstInvalid =
            section.querySelector(
                ".invalid"
            );

        if (firstInvalid) {

            firstInvalid.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }


    return valid;
}


/* =====================================================
   CONTINUE BUTTON
   ===================================================== */

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function() {

            if (!validateSection(currentSection)) {
                return;
            }

            if (
                currentSection <
                sections.length - 1
            ) {

                currentSection++;

                updateView();
            }
        }
    );
}


/* =====================================================
   BACK BUTTON
   ===================================================== */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function() {

            if (currentSection > 0) {

                currentSection--;

                updateView();
            }
        }
    );
}


/* =====================================================
   CLEAR ERRORS WHEN USER EDITS INPUT
   ===================================================== */

if (form) {

    form.querySelectorAll(
        "input, select, textarea"
    ).forEach(function(field) {


        field.addEventListener(
            "input",
            function() {

                clearFieldError(field);
            }
        );


        field.addEventListener(
            "change",
            function() {

                clearFieldError(field);


                const parent =
                    field.closest(".field");


                if (parent) {

                    const groupError =
                        parent.querySelector(
                            ".group-error"
                        );

                    if (groupError) {
                        groupError.textContent = "";
                    }
                }


                if (field.id === "consent") {

                    const error =
                        document.getElementById(
                            "consentError"
                        );

                    if (error) {
                        error.textContent = "";
                    }
                }


                if (field.id === "guidelines") {

                    const error =
                        document.getElementById(
                            "guidelinesError"
                        );

                    if (error) {
                        error.textContent = "";
                    }
                }
            }
        );
    });
}


/* =====================================================
   FORM SUBMISSION
   ===================================================== */

if (form) {

    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            /*
             * Make sure the final section
             * passes validation.
             */

            if (!validateSection(currentSection)) {
                return;
            }


            /* Get teenager's name */

            const preferredName =
                document
                    .getElementById(
                        "preferredName"
                    )
                    .value
                    .trim();


            const fullName =
                document
                    .getElementById(
                        "teenName"
                    )
                    .value
                    .trim();


            const displayName =
                preferredName ||
                fullName ||
                "RBN Family";


            /* Put name on success page */

            if (successName) {

                successName.textContent =
                    displayName;
            }


            /* Hide form */

            form.classList.add(
                "hidden"
            );


            /* Hide progress */

            const progressWrap =
                document.querySelector(
                    ".progress-wrap"
                );

            if (progressWrap) {

                progressWrap.classList.add(
                    "hidden"
                );
            }


            /* Hide hero */

            const hero =
                document.querySelector(
                    ".hero"
                );

            if (hero) {

                hero.classList.add(
                    "hidden"
                );
            }


            /* Show success page */

            if (success) {

                success.classList.remove(
                    "hidden"
                );
            }


            /* Go to top */

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            /*
             * IMPORTANT:
             *
             * At this stage this is a FRONT-END form.
             *
             * The information is NOT yet being saved
             * to a database or sent to WhatsApp/email.
             *
             * We will connect this section to your
             * backend when we build the registration
             * storage system.
             */
        }
    );
}


/* =====================================================
   REGISTER ANOTHER TEENAGER
   ===================================================== */

if (newRegistration) {

    newRegistration.addEventListener(
        "click",
        function() {


            /* Reset form */

            if (form) {
                form.reset();
            }


            /* Return to first section */

            currentSection = 0;


            /* Show form */

            if (form) {

                form.classList.remove(
                    "hidden"
                );
            }


            /* Show progress */

            const progressWrap =
                document.querySelector(
                    ".progress-wrap"
                );

            if (progressWrap) {

                progressWrap.classList.remove(
                    "hidden"
                );
            }


            /* Show hero */

            const hero =
                document.querySelector(
                    ".hero"
                );

            if (hero) {

                hero.classList.remove(
                    "hidden"
                );
            }


            /* Hide success page */

            if (success) {

                success.classList.add(
                    "hidden"
                );
            }


            /* Clear errors */

            if (form) {

                form.querySelectorAll(
                    ".error"
                ).forEach(
                    function(error) {

                        error.textContent = "";
                    }
                );


                form.querySelectorAll(
                    ".invalid"
                ).forEach(
                    function(field) {

                        field.classList.remove(
                            "invalid"
                        );
                    }
                );
            }


            /* Refresh display */

            updateView();
        }
    );
}


/* =====================================================
   INITIALIZE FORM
   ===================================================== */

updateView();
