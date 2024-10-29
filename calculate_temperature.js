// Función para convertir las unidades de temperatura
function convertTemperature(value, fromUnit) {
    let tempK;
    if (fromUnit === 'F') {
        tempK = (value - 32) * 5.0 / 9.0 + 273.15;  // De Fahrenheit a Kelvin
    } else if (fromUnit === 'C') {
        tempK = value + 273.15;  // De Celsius a Kelvin
    } else {
        tempK = value;  // Si ya está en Kelvin
    }
    return tempK;
}

// Función para convertir Kelvin a la unidad deseada
function convertFromKelvin(tempK, toUnit) {
    if (toUnit === 'F') {
        return (tempK - 273.15) * 9.0 / 5.0 + 32;  // Kelvin a Fahrenheit
    } else if (toUnit === 'C') {
        return tempK - 273.15;  // Kelvin a Celsius
    }
    return tempK;  // Si es Kelvin, retorna tal cual
}

// Función para calcular las propiedades simuladas
function calculateProperties(temp, temp_unit) {
    const tempK = convertTemperature(temp, temp_unit);

    if (tempK < 273.06 || tempK > 647.096) {
        throw new Error("Temperature must be between 273.06 K and 647.096 K.");
    }

    // Convertir la temperatura desde Kelvin a la unidad seleccionada
    const convertedTemp = convertFromKelvin(tempK, temp_unit);

    // Simulación de propiedades usando fórmulas aproximadas
    return {
        temp: convertedTemp.toFixed(2),
        tempUnit: temp_unit,
        Vapor_Pressure: (0.000611 * Math.pow(10, ((tempK - 273.15) / 10))).toFixed(4),  // Fórmula simplificada
        Latent_Heat_Vapor: (2257 - (tempK - 273.15) * 0.5).toFixed(2),  // Latent heat (simulación)
        Specific_Enthalpy_Saturated_Vapor: (2500 + (tempK - 273.15) * 10).toFixed(2),
        Specific_Enthalpy_Saturated_Water: (420 + (tempK - 273.15) * 5).toFixed(2),
        Specific_Volume_Saturated_Vapor: (0.001 + (tempK - 273.15) * 0.0001).toFixed(6),
        Specific_Volume_Saturated_Water: (0.001 / (tempK - 273.15 + 1)).toFixed(6),
    };
}

// Manejar el formulario de temperatura
document.getElementById('temperatureForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Prevenir la recarga de la página

    const temperature = parseFloat(document.getElementById('temperature').value);
    const temp_unit = document.getElementById('temp_unit').value;
    
    if (isNaN(temperature) || !temp_unit) {
        showError("Please enter a valid temperature and select a unit.");
        return;
    }

    try {
        const results = calculateProperties(temperature, temp_unit);
        displayResults(results);
    } catch (error) {
        showError(error.message);
    }
});

// Función para mostrar los resultados en la página
function displayResults(results) {
    const unitSymbol = results.tempUnit === 'F' ? '°F' : results.tempUnit === 'C' ? '°C' : 'K';

    // Mostrar la temperatura con el símbolo de unidad
    document.getElementById('temp').textContent = `${results.temp} ${unitSymbol}`;
    
    // Mostrar las demás propiedades sin símbolo de unidad específico
    document.getElementById('pressure').textContent = results.Vapor_Pressure;
    document.getElementById('latent_heat').textContent = results.Latent_Heat_Vapor;
    document.getElementById('enthalpy_vapor').textContent = results.Specific_Enthalpy_Saturated_Vapor;
    document.getElementById('enthalpy_water').textContent = results.Specific_Enthalpy_Saturated_Water;
    document.getElementById('volume_vapor').textContent = results.Specific_Volume_Saturated_Vapor;
    document.getElementById('volume_water').textContent = results.Specific_Volume_Saturated_Water;

    // Ocultar cualquier mensaje de error si es necesario
    document.getElementById('error').classList.add('d-none');
}

// Función para mostrar errores
function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error').classList.remove('d-none');
}

// Función para limpiar los campos de entrada y los resultados
document.getElementById('cleanBtn').addEventListener('click', function () {
    // Limpiar las entradas
    document.getElementById('temperature').value = '';
    document.getElementById('temp_unit').value = '';

    // Limpiar los resultados
    document.getElementById('temp').textContent = '-';
    document.getElementById('pressure').textContent = '-';
    document.getElementById('latent_heat').textContent = '-';
    document.getElementById('enthalpy_vapor').textContent = '-';
    document.getElementById('enthalpy_water').textContent = '-';
    document.getElementById('volume_vapor').textContent = '-';
    document.getElementById('volume_water').textContent = '-';

    // Ocultar mensajes de error si los hay
    document.getElementById('error').classList.add('d-none');
});
