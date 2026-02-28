// CONTACT FORM SUBMISSION & VALIDATION

$(function () {
    const $form = $("#contact-form");
    const $attachment = $("#attachment");

    // Only allow image files for attachment
    $attachment.attr("accept", "image/*").on("change", function () {
        const file = this.files[0];
        if (file && !file.type.startsWith("image/")) {
            alert("Only image files are allowed for attachment.");
            this.value = "";
        }
    });

    // jQuery Validation: use default error display, custom messages only
    $form.validate({
        messages: {
            fullname: "Please fill out this field",
            email: "Please fill out this field",
            phone: "Please fill out this field",
            company_name: "Please fill out this field",
            project_name: "Please fill out this field",
            project_desc: "Please fill out this field",
            department: "Please fill out this field"
        }
    });

    $form.on("submit", async function (e) {
        e.preventDefault();

        if (!$form.valid()) return;

        // Collect form data
        const data = {
            fullname: $("#fullname").val(),
            email: $("#email").val(),
            phone: $("#phone").val(),
            company_name: $("#company_name").val(),
            project_name: $("#project_name").val(),
            project_desc: $("#project_desc").val(),
            department: $("#department").val(),
            message: $("#message").val()
        };

        // Send to API
        try {
    const response = await fetch("http://99.79.77.144:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        let errorText = await response.text();
        try {
            console.error("API Error:", JSON.parse(errorText));
        } catch {
            console.error("API Error (non-JSON):", errorText);
        }
        throw new Error(`API responded with status ${response.status}`);
    }
    console.log("POST request successful:", data);
    showSuccessModal(data);

    // Reset the form fields
    this.reset();

    // Clear validation errors and error messages
    $(this).validate().resetForm();

    // Remove all error placeholders and restore original placeholders if any
    $(this).find("input, textarea, select").each(function () {
        var $el = $(this);
        var old = $el.data("old-placeholder");
        if (old !== undefined) {
            $el.attr("placeholder", old);
        } else {
            $el.removeAttr("placeholder");
        }
    });

} catch (err) {
    console.error("Fetch/network error:", err);
    alert("There was a problem sending your message. Please try again later.");
}

    
    });

    // Show success modal with submitted data//

    function showSuccessModal(data) {
        const $modal = $("#success-message");
        if ($modal.length) {
            const $body = $modal.find(".modal-body");
            const originalBody = $body.html();
            $body.html(
                originalBody +
                `<hr>
                <div style="text-align:left;">
                    <strong>Full Name:</strong> ${data.fullname}<br>
                    <strong>Email:</strong> ${data.email}<br>
                    <strong>Phone:</strong> ${data.phone}<br>
                    <strong>Company:</strong> ${data.company_name}<br>
                    <strong>Project Name:</strong> ${data.project_name}<br>
                    <strong>Project Description:</strong> ${data.project_desc}<br>
                    <strong>Department:</strong> ${data.department}<br>
                    <strong>Message:</strong> ${data.message}
                </div>`
            );
            $modal.modal("show").on("hidden.bs.modal", function () {
                $body.html(originalBody);
                $modal.off("hidden.bs.modal");
            });
        } else {
            alert(
                "Your message was sent successfully!\n\n" +
                `Full Name: ${data.fullname}\n` +
                `Email: ${data.email}\n` +
                `Phone: ${data.phone}\n` +
                `Company: ${data.company_name}\n` +
                `Project Name: ${data.project_name}\n` +
                `Project Description: ${data.project_desc}\n` +
                `Department: ${data.department}\n` +
                `Message: ${data.message}`
            );
        }
    }
});