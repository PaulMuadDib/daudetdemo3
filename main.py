def on_button_pressed_a():
    global running
    running = 1
input.on_button_pressed(Button.A, on_button_pressed_a)

def Send_command(note: number, amp: number):
    SonicPiOSC.start_command("/microbit")
    SonicPiOSC.add_float_parameter(note)
    SonicPiOSC.add_float_parameter(amp)
    SonicPiOSC.send_command()

def on_button_pressed_b():
    global running
    running = 0
    Send_command(40, 0)
input.on_button_pressed(Button.B, on_button_pressed_b)

amp = 0
pitch = 0
note = 0
roll = 0
running = 0
running = 0
basic.pause(500)
led.plot(0, 0)
led.plot(1, 0)
led.unplot(1, 1)
SonicPiOSC.initialise(SerialPin.P8, SerialPin.P12, BaudRate.BAUD_RATE115200)
if SonicPiOSC.initialised_state():
    led.plot(2, 0)
    led.unplot(2, 1)
    SonicPiOSC.connect_wi_fi("Sistel Wi-Fi Jean_EXT", "55805580")
    if SonicPiOSC.wifi_connected_state():
        led.plot(3, 0)
        led.unplot(3, 1)
        SonicPiOSC.connect_sonic_pi("192.168.1.175", 4560)
        if SonicPiOSC.sonic_pi_osc_state():
            led.plot(4, 0)
            led.unplot(3, 1)
        else:
            led.unplot(3, 0)
            led.plot(3, 1)
    else:
        led.unplot(2, 0)
        led.plot(2, 1)
else:
    led.unplot(1, 0)
    led.plot(1, 1)

def on_forever():
    global roll, note, pitch, amp
    if running == 1:
        led.plot(2, 4)
        roll = input.rotation(Rotation.ROLL)
        if roll < -90:
            note = 28
        elif roll > 90:
            note = 64
        else:
            note = pins.map(roll, -90, 90, 28, 64)
        pitch = input.rotation(Rotation.PITCH)
        if pitch < -45:
            amp = 0
        elif pitch > 45:
            amp = 1
        else:
            amp = pins.map(pitch, -45, 45, 0, 1)
        Send_command(note, amp)
        basic.pause(250)
    else:
        led.unplot(2, 4)
basic.forever(on_forever)
