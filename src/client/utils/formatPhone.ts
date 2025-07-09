export function formatPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (!digits.startsWith('7') && !digits.startsWith('8')) {
        return phone;
    }

    const clean = digits.replace(/^8/, '7');
    const match = clean.match(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (!match) return phone;

    return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
}
