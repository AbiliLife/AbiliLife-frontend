import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default function RegisterScreen() {

    // State for the form fields
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');


    return (
        <View>
            <Text>
                Register Screen
            </Text>
            {/* Form fields for registration */}
            {/* <FormField label="Username" value={username} onChangeText={setUsername} />
            <FormField label="Email" value={email} onChangeText={setEmail} />
            <FormField label="Phone" value={phone} onChangeText={setPhone} />
            <FormField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <FormField label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry /> */}
            {/* Custom button for registration */}
            {/* <CustomButton title="Register" onPress={() => {}} /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    
})