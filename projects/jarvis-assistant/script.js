if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(canvasApp, 1);
} else {
    window.addEventListener("load", canvasApp, false);
}

function canvasApp() {
    var theCanvas = document.getElementById("canvasOne");
    if (!theCanvas || !theCanvas.getContext) {
        return;
    }

    var context = theCanvas.getContext("2d");
    var displayWidth = theCanvas.width;
    var displayHeight = theCanvas.height;

    // Projection center (origin of our 3D space)
    var projCenterX = displayWidth / 2;
    var projCenterY = displayHeight / 2;

    // Perspective parameters
    var fLen = 280; // Distance from viewer to z=0 plane. Lower values make perspective more dramatic.

    // 3D Sphere Parameters
    var R0 = 85; // Base radius of the sphere to fit beautifully inside the rings
    var numLat = 32; // Latitude bands (excluding poles)
    var numLon = 64; // Longitude lines

    // Pre-generate the sphere grid (latitude-longitude pairs)
    var grid = [];
    for (var i = 1; i < numLat; i++) {
        var theta = (i / numLat) * Math.PI;
        for (var j = 0; j < numLon; j++) {
            var phi = (j / numLon) * 2 * Math.PI;
            grid.push({ theta: theta, phi: phi });
        }
    }

    // Sparse background star-dust inside the glass orb
    var stars = [];
    var numStars = 40;
    for (var k = 0; k < numStars; k++) {
        // Random spherical coordinates for stars to keep them inside the orb
        var sTheta = Math.random() * Math.PI;
        var sPhi = Math.random() * 2 * Math.PI;
        var sRadius = Math.random() * 120 + 20; // Drifts from core outwards
        stars.push({
            x: sRadius * Math.sin(sTheta) * Math.cos(sPhi),
            y: sRadius * Math.cos(sTheta),
            z: sRadius * Math.sin(sTheta) * Math.sin(sPhi),
            size: Math.random() * 1.0 + 0.4,
            opacity: Math.random() * 0.35 + 0.1
        });
    }

    // Animation states
    var time = 0;
    var angleY = 0;
    var angleX = 0;

    // Speed of rotations
    var rotSpeedY = 0.0055;
    var rotSpeedX = 0.0035;

    function drawFrame() {
        time += 1;
        angleY = (angleY + rotSpeedY) % (2 * Math.PI);
        angleX = (angleX + rotSpeedX) % (2 * Math.PI);

        // Clear the canvas
        context.clearRect(0, 0, displayWidth, displayHeight);

        // 1. Draw Core Glow (underneath the dots)
        var coreGlow = context.createRadialGradient(projCenterX, projCenterY, 0, projCenterX, projCenterY, 80);
        coreGlow.addColorStop(0, "rgba(0, 136, 255, 0.45)");
        coreGlow.addColorStop(0.4, "rgba(0, 50, 200, 0.15)");
        coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.fillStyle = coreGlow;
        context.fillRect(0, 0, displayWidth, displayHeight);

        // Setup rotation trigonometric terms
        var cosY = Math.cos(angleY);
        var sinY = Math.sin(angleY);
        var cosX = Math.cos(angleX);
        var sinX = Math.sin(angleX);

        // Setup slower rotation for stars (for a nice parallax effect)
        var cosStarY = Math.cos(angleY * 0.4);
        var sinStarY = Math.sin(angleY * 0.4);
        var cosStarX = Math.cos(angleX * 0.4);
        var sinStarX = Math.sin(angleX * 0.4);

        var drawList = [];

        // 2. Process Stars
        for (var idx = 0; idx < stars.length; idx++) {
            var s = stars[idx];
            // Rotate Y
            var x1 = s.x * cosStarY - s.z * sinStarY;
            var z1 = s.x * sinStarY + s.z * cosStarY;
            // Rotate X
            var y2 = s.y * cosStarX - z1 * sinX;
            var z2 = s.y * sinStarX + z1 * cosStarX;

            var scale = fLen / (fLen - z2);
            var projX = x1 * scale + projCenterX;
            var projY = y2 * scale + projCenterY;

            drawList.push({
                type: 'star',
                projX: projX,
                projY: projY,
                z: z2,
                size: s.size * scale,
                opacity: s.opacity
            });
        }

        // 3. Process Sphere Grid Points
        for (var idx = 0; idx < grid.length; idx++) {
            var pt = grid[idx];

            // Twist: Offset longitude based on latitude and time to create a spiral seam
            var twist = 0.75 * Math.sin(pt.theta * 2.0 - time * 0.022);
            var phiDeformed = pt.phi + twist;

            // Wave: Multi-frequency radial undulation deforming the sphere surface
            var wave1 = Math.sin(pt.theta * 3.0 + pt.phi * 2.0 - time * 0.04);
            var wave2 = Math.cos(pt.theta * 2.0 - pt.phi * 3.0 + time * 0.025);
            var r = R0 + 12 * wave1 + 6 * wave2;

            // Base 3D coordinates
            var x = r * Math.sin(pt.theta) * Math.cos(phiDeformed);
            var y = r * Math.cos(pt.theta);
            var z = r * Math.sin(pt.theta) * Math.sin(phiDeformed);

            // Rotate Y
            var x1 = x * cosY - z * sinY;
            var z1 = x * sinY + z * cosY;
            // Rotate X
            var y2 = y * cosX - z1 * sinX;
            var z2 = y * sinX + z1 * cosX;

            var scale = fLen / (fLen - z2);
            var projX = x1 * scale + projCenterX;
            var projY = y2 * scale + projCenterY;

            drawList.push({
                type: 'point',
                projX: projX,
                projY: projY,
                z: z2,
                scale: scale
            });
        }

        // 4. Sort all objects back-to-front (lowest z coordinate is furthest)
        drawList.sort(function (a, b) {
            return a.z - b.z;
        });

        // 5. Render Objects
        for (var idx = 0; idx < drawList.length; idx++) {
            var obj = drawList[idx];

            // Clip boundaries
            if (obj.projX < 0 || obj.projX > displayWidth || obj.projY < 0 || obj.projY > displayHeight) {
                continue;
            }

            if (obj.type === 'star') {
                // Dim stars based on depth
                var alpha = obj.opacity * (0.35 + 0.65 * (obj.z + 120) / 240);
                alpha = Math.max(0, Math.min(1, alpha));
                context.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
                context.beginPath();
                context.arc(obj.projX, obj.projY, obj.size, 0, 2 * Math.PI);
                context.fill();
            } else {
                // Normalized depth factor from 0 (back) to 1 (front)
                var depthFactor = (obj.z + 105) / 210;
                depthFactor = Math.max(0, Math.min(1, depthFactor));

                // Size and opacity scaling based on perspective and depth
                var size = (0.75 + 1.25 * depthFactor) * obj.scale;
                var opacity = 0.22 + 0.78 * depthFactor;

                // Color interpolation: Back is deep royal blue, front is bright electric cyan/blue
                var r = 0;
                var g = Math.round(55 * (1 - depthFactor) + 225 * depthFactor);
                var b = Math.round(200 * (1 - depthFactor) + 255 * depthFactor);

                context.fillStyle = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
                context.beginPath();
                context.arc(obj.projX, obj.projY, size, 0, 2 * Math.PI);
                context.fill();
            }
        }

        requestAnimationFrame(drawFrame);
    }

    // Start requestAnimationFrame loop
    requestAnimationFrame(drawFrame);
}