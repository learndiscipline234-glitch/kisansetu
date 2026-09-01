from typing import Dict, Any
from .mandi_aggregator import mandi_service
from .ml_forecaster import forecaster_service

class MultilingualVoiceAssistant:
    def __init__(self):
        pass

    def process_voice_query(self, query: str, language: str = "hi") -> Dict[str, Any]:
        q_lower = query.lower()
        
        # 1. Identify Commodity
        crops = ["wheat", "गेहूं", "गहू", "tomato", "टमाटर", "टोमॅटो", "onion", "प्याज", "कांदा", "soybean", "सोयाबीन", "cotton", "कपास", "कापूस", "mustard", "सरसों", "मोहरी", "potato", "आलू", "बटाटा", "turmeric", "हल्दी", "हळद", "chana", "चना", "हरभरा", "maize", "मक्का", "मका"]
        
        detected_crop = "Wheat"
        for c in crops:
            if c in q_lower:
                if c in ["wheat", "गेहूं", "गहू"]: detected_crop = "Wheat"
                elif c in ["tomato", "टमाटर", "टोमॅटो"]: detected_crop = "Tomato"
                elif c in ["onion", "प्याज", "कांदा"]: detected_crop = "Onion"
                elif c in ["soybean", "सोयाबीन"]: detected_crop = "Soybean"
                elif c in ["cotton", "कपास", "कापूस"]: detected_crop = "Cotton"
                elif c in ["mustard", "सरसों", "मोहरी"]: detected_crop = "Mustard"
                elif c in ["potato", "आलू", "बटाटा"]: detected_crop = "Potato"
                elif c in ["turmeric", "हल्दी", "हळद"]: detected_crop = "Turmeric"
                elif c in ["chana", "चना", "हरभरा"]: detected_crop = "Chana"
                elif c in ["maize", "मक्का", "मका"]: detected_crop = "Maize"
                break
                
        # 2. Check Intent
        is_sale_window = any(w in q_lower for w in ["hold", "sell", "window", "रुकना", "बेचना", "कब बेचूं", "थांबू", "विकू", "advice", "trend", "भविष्य"])
        is_quality = any(w in q_lower for w in ["quality", "grade", "क्वालिटी", "ग्रेड", "दर्जा", "certificate", "सर्टिफिकेट"])
        is_escrow = any(w in q_lower for w in ["payment", "escrow", "रुपये", "पैसे", "पेमेंट", "खाते", "release"])
        is_fpo = any(w in q_lower for w in ["fpo", "pool", "समूह", "एकत्र", "ग्रुप", "bulk"])
        
        # Get live mandi price for detected crop
        mandis = mandi_service.get_all_records(commodity=detected_crop)
        modal_price = mandis[0]["modal_price"] if mandis else 2400.0
        mandi_name = mandis[0]["mandi_name"] if mandis else "Regional APMC"
        
        forecast = forecaster_service.forecast_commodity_price(detected_crop, modal_price, mandi_name)
        
        if is_sale_window:
            intent = "SALE_WINDOW_ADVICE"
            if language == "hi":
                resp = f"किसान भाई, {detected_crop} का आज का भाव ₹{modal_price} प्रति क्विंटल है। AI भविष्यवाणी के अनुसार, {forecast['sale_window_recommendation']}। आपको {forecast['optimal_sale_date']} तक ₹{forecast['expected_gain_percent']}% का लाभ मिल सकता है।"
            elif language == "mr":
                resp = f"शेतकरी बंधूंनो, {detected_crop} चा आजचा बाजारभाव ₹{modal_price} प्रति क्विंटल आहे. AI सल्ल्यानुसार, {forecast['sale_window_recommendation']} करा. {forecast['optimal_sale_date']} पर्यंत {forecast['expected_gain_percent']}% जास्त नफा मिळू शकतो."
            elif language == "te":
                resp = f"రైతు సోదరులారా, {detected_crop} ప్రస్తుత మార్కెట్ ధర క్వింటాలుకు ₹{modal_price}. AI సూచన ప్రకారం, {forecast['sale_window_recommendation']} చేయడం మంచిది."
            elif language == "pa":
                resp = f"ਕਿਸਾਨ ਵੀਰੋ, {detected_crop} ਦਾ ਅੱਜ ਦਾ ਭਾਅ ₹{modal_price} ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਹੈ। AI ਸਲਾਹ ਅਨੁਸਾਰ {forecast['sale_window_recommendation']}।"
            else:
                resp = f"Farmer Friend, the current modal price for {detected_crop} in {mandi_name} is ₹{modal_price}/Q. AI Advisor recommends: {forecast['sale_window_recommendation']}. Optimal realization around {forecast['optimal_sale_date']} (+{forecast['expected_gain_percent']}% gain)."

        elif is_quality:
            intent = "QUALITY_GRADING_INFO"
            if language == "hi":
                resp = f"{detected_crop} का AI क्वालिटी ग्रेडिंग कैमरा से फोटो खींचकर तुरंत हो जाता है। ग्रेड-A फसल पर व्यापारियों से 10% से 15% अधिक भाव (लगभग ₹{round(modal_price * 1.15)}) और तुरंत डिजिटल सर्टिफिकेट मिलता है।"
            elif language == "mr":
                resp = f"{detected_crop} साठी AI द्वारे फोटो स्कॅन करून डिजिटल ग्रेड-A प्रमाणपत्र मिळते. यामुळे व्यापाऱ्यांकडून १०-१५% जास्त भाव मिळतो."
            else:
                resp = f"Our AI Computer Vision system grades your {detected_crop} produce into Grade A/B/C from mobile camera photos, unlocking 12-15% premium price from institutional buyers."

        elif is_escrow:
            intent = "ESCROW_PAYMENT_INFO"
            if language == "hi":
                resp = "किसान सेतु एस्क्रो प्रणाली में खरीदार का 100% पैसा पहले ही सुरक्षित बैंक खाते में जमा हो जाता है। फसल पहुंचते ही ओटीपी सत्यापन के बाद तुरंत आपके बैंक/UPI खाते में पैसे ट्रांसफर हो जाते हैं।"
            elif language == "mr":
                resp = "किसान सेतू एस्क्रो मध्ये खरेदीदाराचे संपूर्ण पैसे सुरक्षित असतात. मालाची डिलिव्हरी होताच थेट तुमच्या बँकेत जमा होतात."
            else:
                resp = "With KisanSetu Smart Escrow, buyer funds are pre-locked in verified bank vaults and released directly to your UPI/Bank within 60 seconds of digital delivery verification."

        elif is_fpo:
            intent = "FPO_POOLING_INFO"
            if language == "hi":
                resp = "FPO पूल में छोटे किसान मिलकर 100 से 500 क्विंटल की बड़ी खेप बनाते हैं, जिससे ITC और रिलायंस जैसे बड़े खरीदार 6% से 8% प्रीमियम भाव देते हैं और ट्रांसपोर्ट का खर्च भी आधा हो जाता है।"
            else:
                resp = "FPO pooling aggregates smallholder farmer harvests into 500+ Quintal institutional lots, securing 6-8% premium pricing and 40% lower freight per quintal."

        else: # Default Price Check
            intent = "MANDI_PRICE_CHECK"
            if language == "hi":
                resp = f"{mandi_name} में {detected_crop} का आज का मॉडल भाव ₹{modal_price} प्रति क्विंटल है। (न्यूनतम: ₹{mandis[0]['min_price']}, अधिकतम: ₹{mandis[0]['max_price']})। पिछले 24 घंटे में {mandis[0]['price_change_24h']}% का बदलाव आया है।"
            elif language == "mr":
                resp = f"{mandi_name} मध्ये {detected_crop} चा आजचा भाव ₹{modal_price} प्रति क्विंटल आहे."
            elif language == "te":
                resp = f"{mandi_name} లో {detected_crop} ధర క్వింటాలుకు ₹{modal_price}."
            elif language == "pa":
                resp = f"{mandi_name} ਵਿਖੇ {detected_crop} ਦਾ ਭਾਅ ₹{modal_price} ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਹੈ।"
            else:
                resp = f"The modal price for {detected_crop} at {mandi_name} is ₹{modal_price}/Quintal (Range: ₹{mandis[0]['min_price']} - ₹{mandis[0]['max_price']})."

        return {
            "query": query,
            "detected_intent": intent,
            "detected_crop": detected_crop,
            "language": language,
            "speech_response_text": resp,
            "structured_data": {
                "commodity": detected_crop,
                "mandi": mandi_name,
                "current_price": modal_price,
                "recommendation": forecast["sale_window_recommendation"],
                "gain_percent": forecast["expected_gain_percent"]
            }
        }

voice_service = MultilingualVoiceAssistant()
