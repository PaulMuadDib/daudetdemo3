input.onButtonPressed(Button.A, function () {
    if (running == 0) {
        running = 1
    } else {
        running = 0
    }
})
input.onButtonPressed(Button.B, function () {
    led.unplot(sensibility - 1, 2)
    sensibility += 1
    if (sensibility > 5) {
        sensibility = 1
    }
    led.plot(sensibility - 1, 2)
})
let acc = 0
let rollout = 0
let pitchout = 0
let roll = 0
let pitch = 0
let sensibility = 0
let running = 0
input.setAccelerometerRange(AcceleratorRange.EightG)
radio.setGroup(123)
running = 0
let gravity = 9.81
let pitchmax = 45
let rollmax = 60
sensibility = 2
led.plot(sensibility - 1, 2)
basic.pause(500)
led.plot(0, 0)
led.plot(1, 0)
led.unplot(1, 1)
SonicPiOSC.initialise(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
if (SonicPiOSC.initialisedState()) {
    led.plot(2, 0)
    led.unplot(2, 1)
    SonicPiOSC.connectWiFi("iPhone", "gabg06000")
    if (SonicPiOSC.wifiConnectedState()) {
        led.plot(3, 0)
        led.unplot(3, 1)
        SonicPiOSC.connectSonicPi("172.20.10.12", 4560)
        if (SonicPiOSC.sonicPiOSCState()) {
            led.plot(4, 0)
            led.unplot(3, 1)
        } else {
            led.unplot(3, 0)
            led.plot(3, 1)
        }
    } else {
        led.unplot(2, 0)
        led.plot(2, 1)
    }
} else {
    led.unplot(1, 0)
    led.plot(1, 1)
}
basic.forever(function () {
    if (running == 1) {
        led.plot(2, 4)
        pitch = input.rotation(Rotation.Pitch)
        if (pitch < -1 * pitchmax) {
            pitch = -1 * pitchmax
        } else if (pitch > pitchmax) {
            pitch = pitchmax
        }
        roll = input.rotation(Rotation.Roll)
        if (roll < -1 * rollmax) {
            roll = -1 * rollmax
        } else if (roll > rollmax) {
            roll = rollmax
        }
        pitchout = 127 * ((pitch + pitchmax) / (2 * pitchmax))
        rollout = 100 * ((roll + rollmax) / (2 * rollmax)) + 10
        SonicPiOSC.startCommand("/microbit/roll")
        SonicPiOSC.addFloatParameter(rollout)
        SonicPiOSC.sendCommand()
        SonicPiOSC.startCommand("/microbit/pitch")
        SonicPiOSC.addFloatParameter(pitchout)
        SonicPiOSC.sendCommand()
        SonicPiOSC.startCommand("/microbit/accx")
        SonicPiOSC.addFloatParameter(input.acceleration(Dimension.X) * 0.001 * gravity)
        SonicPiOSC.sendCommand()
        SonicPiOSC.startCommand("/microbit/accy")
        SonicPiOSC.addFloatParameter(input.acceleration(Dimension.Y) * 0.001 * gravity)
        SonicPiOSC.sendCommand()
        SonicPiOSC.startCommand("/microbit/accz")
        SonicPiOSC.addFloatParameter(input.acceleration(Dimension.Z) * 0.001 * gravity)
        SonicPiOSC.sendCommand()
        acc = input.acceleration(Dimension.Y) * 0.001 * gravity
        if (acc > gravity * 1) {
            SonicPiOSC.startCommand("/hand0")
            SonicPiOSC.addFloatParameter(rollout)
            SonicPiOSC.addFloatParameter(rollout)
            SonicPiOSC.addFloatParameter(rollout)
            SonicPiOSC.addFloatParameter(rollout)
            SonicPiOSC.addFloatParameter(rollout)
            SonicPiOSC.addFloatParameter(rollout)
            SonicPiOSC.sendCommand()
            SonicPiOSC.startCommand("/hand1")
            SonicPiOSC.addFloatParameter(sensibility * acc)
            SonicPiOSC.addFloatParameter(sensibility * acc)
            SonicPiOSC.addFloatParameter(sensibility * acc)
            SonicPiOSC.addFloatParameter(sensibility * acc)
            SonicPiOSC.addFloatParameter(sensibility * acc)
            SonicPiOSC.addFloatParameter(sensibility * acc)
            SonicPiOSC.sendCommand()
            basic.pause(10)
        }
    } else {
        led.unplot(2, 4)
    }
})
