# Build An Alexa Skill with the Audio Player Interface (Node.js)

This Alexa sample skill is a template for using the AudioPlayer interface for Alexa-hosted skills.
Note that as this code is set up so that you can directly import this skill into your hosted skill.
Check out the Documentation below for links on how to import this skill directly from the Alexa
developer console.

## Skill Architecture
The skill consists of an inteface model and logic of the skill. This sample contains a sample skill that plays a single audio stream,
along with handlers for all of the AudioPlayer events, touch controls and error handling.
The skill also uses DynamoDB to keep track of current playback information.

## Additional Resources

### Documentation
* [AudioPlayer Interface](https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html)
* [Audio stream/file requirements](https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#audio-stream-requirements)
* [Import a skill from a Git repository](https://developer.amazon.com/docs/alexa/hosted-skills/alexa-hosted-skills-git-import.html)

### Other Samples
* [Previous AudioPlayer samples (ASK CLI v1, ASK SDK v1)](https://github.com/alexa/skill-sample-nodejs-audio-player/releases)

<code>
import com.google.zxing.*;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class GenerateQRCode {
    //static function that creates QR Code
    public static void generateQRcode(String data, String path, String charset, Map map, int h, int w) throws WriterException, IOException {
        //the BitMatrix class represents the 2D matrix of bits
        //MultiFormatWriter is a factory class that finds the appropriate Writer subclass for the BarcodeFormat requested and encodes the barcode with the supplied contents.
        BitMatrix matrix = new MultiFormatWriter().encode(new String(data.getBytes(charset), charset), BarcodeFormat.QR_CODE, w, h);
        MatrixToImageWriter.writeToPath(matrix, path.substring(path.lastIndexOf('.') + 1), new File(path).toPath());
    }

    //main() method
    public static void main(String[] args) throws WriterException, IOException, NotFoundException {
        //data that we want to store in the QR code
        String str = "this router we will use OpenSWAN software.However as we don’t have access to corporate network; for this exercise, we will simulate the corporate network by using another AWS VPC in another AWS region. We will configure EC2 in this VPC which acts as the router at customer end. For this router we will use OpenSWAN software. se, we will simulate the corporate network by using another AWS VPC in another AWS region. We will configure EC2 in this VPC which acts as the router at customer end. For this";
        System.out.println("length is " + str.length());
        //path where we want to get QR Code
        String path = "/tmp/Quote.png";
        //Encoding charset to be used
        String charset = "UTF-8";
        Map<EncodeHintType, ErrorCorrectionLevel> hashMap = new HashMap<EncodeHintType, ErrorCorrectionLevel>();
        //generates QR code with Low level(L) error correction capability
        hashMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
        //invoking the user-defined method that creates the QR code
        generateQRcode(str, path, charset, hashMap, 200, 200);//increase or decrease height and width accodingly
        //prints if the QR code is generated
        System.out.println("QR Code created successfully.");
    }
}  
    </code>
