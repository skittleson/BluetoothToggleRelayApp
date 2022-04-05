//https://web.dev/bluetooth/

const logElement = document.getElementById("log");
const primaryServiceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const toggleCharacteristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
let device = null;

async function buttonBleToggleAsync(src) {
  if (!!!device) {
    device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [primaryServiceUUID] }],
    });
    log(`Pairing device: ${device.name}`);
  }
  // if (!device.gatt.connected) {
  const server = await device.gatt.connect();
  // }
  log(`Device is connected: ${server.connected}`);
  // if (!device.gatt.connected) {
  //   return;
  // }

  const service = await server.getPrimaryService(primaryServiceUUID);
  log(`Service: ${service.uuid} is primary ${service.isPrimary}`);
  const toggleCharacteristic = await service.getCharacteristic(
    toggleCharacteristicUUID
  );
  // debugger;

  try {
    let encoder = new TextEncoder("utf-8");
    await toggleCharacteristic.writeValue(encoder.encode("1"));
  } catch (error) {
    log(error);
    // console.log(error);
  }
}

function log(message) {
  logElement.value += "\n" + message;
}

window.addEventListener("beforeunload", async function (event) {
  if (device) {
    await device.gatt.disconnect();
  }
});
