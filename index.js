const { createCanvas, loadImage, registerFont } = require('canvas');

// Function to split the text if it exceeds the maximum length and needs to be drawn on multiple lines
function splitText(text, maxWidth, ctx) {
    let words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Async function to create an image with an image background and add text
const createImage = async (username, nameGroup, profileImagePath, backgroundImagePath, xPos, yPos, rotationAngle = 0) => {
    try {
        registerFont('./fonts/BeautifulNight-0v0lP.otf', { family: 'BeautifulNight-0v0lP' });
        registerFont('./fonts/StoryMilky-1jZwL.ttf', { family: 'StoryMilky-1jZwL' });

        // Load the profile and background images
        const [profileImage, background] = await Promise.all([
            loadImage(profileImagePath),
            loadImage(backgroundImagePath)
        ]);

        // Create a canvas with the dimensions of the background image
        const canvas = createCanvas(background.width, background.height);
        const ctx = canvas.getContext('2d');

        // Draw the background image
        ctx.drawImage(background, 0, 0, background.width, background.height);

        // Save the context's state
        ctx.save();

        // Prepare to draw the profile image within a rotated hexagon
        ctx.translate(xPos, yPos);
        ctx.rotate((rotationAngle * Math.PI) / 180);
        ctx.translate(-xPos, -yPos);

        const targetSize = 799;  // Width for the hexagon
        const profileX = xPos - targetSize / 2;
        const profileY = yPos - targetSize / 2;

        // Create a hexagonal clipping region
        ctx.beginPath();
        const numberOfSides = 6;
        const step = (2 * Math.PI) / numberOfSides;
        const radius = targetSize / 2;
        for (let i = 0; i < numberOfSides; i++) {
            const angle = i * step - Math.PI / 2;
            const x = xPos + radius * Math.cos(angle);
            const y = yPos + radius * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.clip();

        // Draw the resized profile image in the hexagonal clip
        ctx.drawImage(profileImage, profileX, profileY, targetSize, targetSize);

        // Restore the context to its original state
        ctx.restore();

        // Text options for "NAMA"
        ctx.font = `250px 'BeautifulNight-0v0lP'`;
        ctx.fillStyle = '#D97232';
        let textYPos = 240;
        const maxWidth = 1400;  // Maximum width of the text line, adjust as needed
        let lines = splitText(username.slice(0, 28) + '..', maxWidth, ctx);
        lines.forEach(line => {
            ctx.fillText(line, 118, textYPos);
            textYPos += 160; // Adjust line spacing accordingly
        });
        ctx.fillStyle = '#53d6ff';
        let textYPos2 = 235;
        const maxWidth2 = 1400;  // Maximum width of the text line, adjust as needed
        let lines2 = splitText(username.slice(0, 28) + '..', maxWidth2, ctx);
        lines2.forEach(line => {
            ctx.fillText(line, 120, textYPos2);
            textYPos2 += 160; // Adjust line spacing accordingly
        });

        // Text options for "NAMAGROUP"
        ctx.font = `70px 'StoryMilky-1jZwL'`;
        ctx.fillStyle = 'white';
        ctx.fillText(nameGroup.slice(0, 17) + '..', 30, 738); // Adjust position and content as needed

        // Save the final image
        const buffer = canvas.toBuffer('image/png');
        require('fs').writeFileSync('./tests/photo.png', buffer);
        // console.log(buffer)
        return buffer
    } catch (error) {
        // Log any errors that occur during the process
        console.error('An error occurred while creating the image:', error);
    }
};

// Example usage of the function with manual positioning
// createImage('Aaaaaaaaa Najmy ssssssssssss', 'namagrouppppppppppppppppppp', 'zee.jpg', 'background2.png', 1415, 715, 0);

module.exports = { createImage };
