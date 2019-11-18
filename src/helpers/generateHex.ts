/**
 * By default new user has no avatar, so sript generate random color based on
 * user _id, front-end will make gradient from this color
 */
export default (string: string): string => {
    function hashCode(str: string):number {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
           hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    } 
    
    function intToRGB(i: number):string {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
    
        return "00000".substring(0, 6 - c.length) + c;
    }

    return('#'+intToRGB(hashCode(string)))
}