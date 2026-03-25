from flask import Flask, render_template, request, jsonify, abort, session, redirect, url_for
import requests
import datetime
import os

app = Flask(__name__)
app.secret_key = "bonaji_secret_key_123" # সেশন এর জন্য এটি অবশ্যই লাগবে

# --- CONFIGURATION ---
GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzoHctCWfRz8ZS8I9hUq58PJ1EfOf2Dv62cwWhFOUxGW1JlVL1OIHcg_BlSUj6MFrT9/exec"
DAT_FILE_PATH = "all_orders.dat" # Saves in the project folder

# Detailed Product Data for Landing Pages
PRODUCT_DETAILS = {
    "7-days-course": {
        "name": "৭ দিনের কোর্স", "price": 500,
        "hero_msg": "৭ দিনের কোর্স",
        "hero_p": "আমাদের প্রাচীন আয়ুর্বেদ ফর্মুলা দিয়ে সুস্বাস্থ্য জীবন গড়ুন ! ফিট থাকুন, এবং আপনার শরীরকে দিন নতুন শক্তি।",
        "description": "এটি একটি সম্পূর্ণ প্রাকৃতিক ফর্মুলা যা আপনার শরীরের রোগ প্রতিরোধ ক্ষমতা বাড়াবে,শরিরে ক্যালসিয়ামের মাত্রা বৃদ্ধি করবে, বির্যের ঘনত্ব বাড়াবে, বিশেষ সময় কে বৃদ্ধি করবে।",
        "ingredients": "রেড জিনসেং, হোয়াইট জিনসেং, শতমূল, আলকুশি, অশ্বগন্ধা, ও, বির্যমণী",
        "benefits": ["১০০% প্রাকৃতিক।", "শরিরে ক্যালসিয়ামের মাত্রা বৃদ্ধি করবে।", "বির্যের ঘনত্ব বাড়াবে।", "বিশেষ সময় কে বৃদ্ধি করবে।", "সম্পূর্ণ প্রাকৃতিক উপাদানে তৈরি।", "কোন পার্শ্বপ্রতিক্রিয়া নেই।", "দ্রুত কার্যকর।"],
        "image": "static/Image/7 Days Course.jpg",
        "video_url": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F4151099761803652%2F&show_text=0&autoplay=1&mute=1"
    },
    "weight-loss": {
        "name": "ওয়েট লস প্যাক", "price": 850,
        "hero_msg": "ওয়েট লস প্যাক",
        "hero_p": "আমাদের প্রাচীন আয়ুর্বেদ ফর্মুলা দিয়ে সুস্বাস্থ্য জীবন গড়ুন ! ফিট থাকুন, এবং আপনার শরীরকে দিন নতুন শক্তি।",
        "description": "ব্যায়াম ছাড়াই নিরাপদ ভাবে ওজন কমাতে আমাদের এই হার্বাল প্যাকটি অত্যন্ত কার্যকর।",
        "ingredients": "গ্রিন টি এক্সট্রাক্ট, আদা, লেবু, দারুচিনি।",
        "benefits": ["মেদ কমায়", "হজম শক্তি বাড়ায়", "শরীর সতেজ রাখে"],
        "image": "static/Image/Wet Loss.jpg",
        "video_url": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F1501666217730556%2F&show_text=0&autoplay=1&mute=1"
    },
    "allergy-remedy": {
        "name": "এলার্জি রেমিডি", "price": 850,
        "hero_msg": "এলার্জি রেমিডি",
        "hero_p": "আমাদের প্রাচীন আয়ুর্বেদ ফর্মুলা দিয়ে সুস্বাস্থ্য জীবন গড়ুন ! ফিট থাকুন, এবং আপনার শরীরকে দিন নতুন শক্তি।",
        "description": "পুরানো এলার্জি বা চর্মরোগের জন্য আমাদের এই বিশেষ হার্বাল কোর্সটি ব্যবহার করুন।",
        "ingredients": "নিম, চিরতা, হলুদ, তুলসী।",
        "benefits": ["চুলকানি কমায়", "রক্ত পরিষ্কার করে", "ত্বক ভালো রাখে"],
        "image": "static/Image/Allergy Remidy.png",
        "video_url": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F1393716085516534%2F&show_text=0&autoplay=1&mute=1"
    },
    "gastro-care": {
        "name": "গ্যাস্ট্র কেয়ার", "price": 600,
        "hero_msg": "গ্যাস্ট্র কেয়ার",
        "hero_p": "আমাদের প্রাচীন আয়ুর্বেদ ফর্মুলা দিয়ে সুস্বাস্থ্য জীবন গড়ুন ! ফিট থাকুন, এবং আপনার শরীরকে দিন নতুন শক্তি।",
        "description": "পেট ফাঁপা, বুক জ্বালাপোড়া ও কোষ্ঠকাঠিন্যের স্থায়ী সমাধান।",
        "ingredients": "ইসবগুল, ত্রিফলা, জৈন, পুদিনা।",
        "benefits": ["হজম বৃদ্ধি", "গ্যাস্ট্রিক নিয়ন্ত্রণ", "কোষ্ঠকাঠিন্য দূর"],
        "image": "static/Image/Wet Loss.jpg",
        "video_url": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F32672361935744616%2F&show_text=0&autoplay=1&mute=1"
    },
    "badam-chatni": {
        "name": "বাদাম চাটনি", "price": 950,
        "hero_msg": "বাদাম চাটনি",
        "hero_p": "আমাদের প্রাচীন আয়ুর্বেদ ফর্মুলা দিয়ে সুস্বাস্থ্য জীবন গড়ুন ! ফিট থাকুন, এবং আপনার শরীরকে দিন নতুন শক্তি।",
        "description": "শরীরের শক্তি বৃদ্ধি ও পুষ্টির চাহিদা পূরণে আমাদের প্রিমিয়াম বাদাম চাটনি।",
        "ingredients": "কাঠবাদাম, কাজুবাদাম, পেস্তাবাদাম, মধু, ঘি।",
        "benefits": ["স্মৃতিশক্তি বৃদ্ধি", "শারীরিক শক্তি বাড়ায়", "প্রাকৃতিক পুষ্টি"],
        "image": "static/Image/Badam Chatni.png",
        "video_url": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F1524849158742387%2F&show_text=0&autoplay=1&mute=1"
    },
    "amasha-care": {
        "name": "আমাশা কেয়ার", "price": 900,
        "hero_msg": "আমাশা কেয়ার",
        "hero_p": "আমাদের প্রাচীন আয়ুর্বেদ ফর্মুলা দিয়ে সুস্বাস্থ্য জীবন গড়ুন ! ফিট থাকুন, এবং আপনার শরীরকে দিন নতুন শক্তি।",
        "description": "আমাশা শুধু সাধারণ পেটের অসুখ নয়—এটি দীর্ঘদিন চলতে থাকলে শরীরের জন্য ভয়াবহ ক্ষতির কারণ হতে পারে। বিশেষ করে রক্ত আমাশা একটি গুরুতর অন্ত্রের সংক্রমণ। এতে পায়খানার সঙ্গে রক্ত, তীব্র পেটব্যথা, দুর্বলতা ও জ্বর দেখা দিতে পারে। সময়মতো সঠিক চিকিৎসা না নিলে এই রোগ ধীরে ধীরে শরীরকে দুর্বল করে দেয় এবং IBS রুপ ধারন করে। দির্ঘদিন ধরে আমাশা হলে শারীরিক সক্ষমতা ও ওজন হ্রাস পায়। মন সতেজ থাকে না।",
        "ingredients": "কাঠবাদাম, কাজুবাদাম, পেস্তাবাদাম, মধু, ঘি।",
        "benefits": ["IBS সমস্যা চিরতরে দূর করে।", "সাদা আম বা মিউকাস যাওয়া বন্ধ করে।", "পেট পরিষ্কার রাখে ও হজম শক্তি বৃদ্ধি করে।", "পেটের অতিরিক্ত গ্যাস দূর করে।", "শরীরে রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে।", "পেটের জ্বালা ও অস্বস্তি দূর করে।", "আমাশয় থেকে চিরতরে মুক্তি মেলে।"],
        "image": "static/Image/Badam Chatni.png",
        "video_url": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F1524849158742387%2F&show_text=0&autoplay=1&mute=1"
    },
    "female-care": {
        "name": "ফিমেল কেয়ার", "price": 900,
        "hero_msg": "ফিমেল কেয়ার",
        "hero_p": "আমাদের প্রাচীন আয়ুর্বেদ ফর্মুলা দিয়ে সুস্বাস্থ্য জীবন গড়ুন ! ফিট থাকুন, এবং আপনার শরীরকে দিন নতুন শক্তি।",
        "description": "ঋতুস্রাব অনিয়ম, অতিরিক্ত বা কম স্রাব এবং পেটব্যথা—এ ধরনের সমস্যায় ভুগছেন ? সাদা স্রাব নারীদের শরীরের একটি স্বাভাবিক শারীরবৃত্তীয় প্রক্রিয়া। তবে যদি স্রাব ঘন, হলুদ বা সবুজ রঙের হয় এবং সাথে তীব্র দুর্গন্ধ কিংবা চুলকানি থাকে, তবে বুঝতে হবে এটি কোনো সংক্রমণের লক্ষণ। প্রধানত ব্যক্তিগত পরিচ্ছন্নতার অভাব, ব্যাকটেরিয়া বা ছত্রাকের আক্রমণ এবং হরমোনের পরিবর্তনের কারণে এই সমস্যাটি দেখা দিয়ে থাকে। এটি দীর্ঘসময় অব্যাহত থাকলে শারীরিক দুর্বলতা, কোমর ব্যথা ও জরায়ুর সংক্রমণের মতো জটিলতা তৈরি করতে পারে। সঠিক সচেতনতা, স্বাস্থ্যবিধি মেনে চলা ও সঠিক ঔষধ সেবনে এই রোগ থেকে দ্রুত মুক্তি পাওয়া সম্ভব।",
        "ingredients": "কাঠবাদাম, কাজুবাদাম, পেস্তাবাদাম, মধু, ঘি।",
        "benefits": ["ঋতুস্রাব নিয়মিত রাখতে সহায়তা করবে।", "মাসিকের সময় পেটব্যথা ও অস্বস্তি কমাতে সাহায্য করবে।", "রক্তসঞ্চালন ও হরমোনাল ব্যালান্স সাপোর্ট করবে।", "শরীরের দুর্বলতা ও ক্লান্তি হ্রাসে সহায়ক।"],
        "image": "static/Image/Badam Chatni.png",
        "video_url": "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F1524849158742387%2F&show_text=0&autoplay=1&mute=1"
    }
}


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/product/<slug>')
def product_info(slug):
    product = PRODUCT_DETAILS.get(slug)
    if not product:
        abort(404)
    return render_template('product_details.html', p=product, slug=slug)

# Keep your existing /submit-order route exactly the same here...

@app.route('/submit-order', methods=['POST'])
def submit_order():
    try:
        # Check if data is coming as JSON or Form
        data = request.get_json() if request.is_json else request.form

        customer_mobile = data.get('Mobile')
        
        now = datetime.datetime.now()
        date_now = now.strftime("%Y-%m-%d %I:%M %p") #Fixed variable name


        # --- 24 HOUR BLOCK LOGIC ---
        if os.path.exists(DAT_FILE_PATH):
            with open(DAT_FILE_PATH, "r", encoding="utf-8") as f:
                lines = f.readlines()
                for line in lines:
                    # Check if the mobile number exists in previous records
                    if customer_mobile in line:
                        # Extract the date string (assuming it's at the start of your line)
                        # Format: 2023-10-27 10:30 AM | Name | ...
                        parts = line.split(" | ")
                        try:
                            order_date_str = parts[0]
                            order_date = datetime.datetime.strptime(order_date_str, "%Y-%m-%d %I:%M %p")
                            
                            # Calculate time difference
                            time_diff = now - order_date
                            if time_diff.total_seconds() < 86400: # 86400 seconds = 24 hours
                                hours_left = round((86400 - time_diff.total_seconds()) / 3600, 1)
                                return jsonify({
                                    "status": "blocked", 
                                    "message": f"আপনি সম্প্রতি একটি অর্ডার করেছেন। পরবর্তী অর্ডারের জন্য কিছুক্ষণ অপেক্ষা করুন। অথবা কল করুনঃ 01912616261"
                                }), 403
                        except:
                            continue

        # --- IF NOT BLOCKED, PROCEED WITH ORDER ---
        date_now_str = now.strftime("%Y-%m-%d %I:%M %p")

        # 1. Save to .dat file
        with open(DAT_FILE_PATH, "a", encoding="utf-8") as f:
            line = f"{date_now} | {data.get('CustomerName')} | {data.get('Address')} | {data.get('Mobile')} | {data.get('Product')} | Qty: {data.get('Quantity')} | {data.get('Weight')} | {data.get('ShippingType')} | Total: {data.get('Total')} TK\n"
            f.write(line)

        # 2. Forward to Google Sheets (Matches your Google Script keys)
        gs_payload = {
            "Date": date_now,
            "CustomerName": data.get('CustomerName'),
            "Address": data.get('Address'),
            "Mobile": data.get('Mobile'),
            "Product": data.get('Product'),
            "Quantity": data.get('Quantity'),
            "Weight": data.get('Weight'),
            "ShippingType": data.get('ShippingType'),
            "Total": data.get('Total')
        }
        # 3. Forward to google sheet
        requests.post(GOOGLE_SHEET_URL, data=gs_payload, timeout=10)

        return jsonify({"status": "success"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    


# For Promembership Form

# Add these to your existing app.py
PRO_SHEET_URL = "https://script.google.com/macros/s/AKfycbxNi49OQarHGEHcPb5WCzd4_6bb1dz-wysMHkSjIR5zzKE2BrYdX1FTAqCxi533djcHqA/exec"

@app.route('/membership')
def membership_page():
    if 'user' in session:
        return redirect(url_for('dashboard'))
    return render_template('membership.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    # Logic: Send to Google Script to check duplicates and save
    response = requests.post(PRO_SHEET_URL, data={
        "action": "register",
        "FullName": data['FullName'],
        "Username": data['Username'],
        "Mobile": data['Mobile'],
        "Email": data['Email'],
        "Password": data['Password'],
        "TxID": data['TxID'],
        "Date": datetime.datetime.now().strftime("%Y-%m-%d")
    })
    return response.text

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    response = requests.post(PRO_SHEET_URL, data={
        "action": "login",
        "Email": data['Email'],
        "Password": data['Password']
    })
    try:
        res_data = response.json()
        if res_data['status'] == "success":
            session['user'] = res_data['user'] # Store user info in session

            # 2. MANUALLY add the password to the session 
            # so the dashboard can use it to refresh the status later
            session['user']['Password'] = data['Password']

            session.permanent = True # Keep them logged in
            return jsonify({"status": "success"})
        else:
            return jsonify({"status": "failed", "message": "Invalid credentials"})
        
    except Exception as e:
            return jsonify({"status": "error", "message": str(e)})

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('membership_page'))
    
    user_email = session['user'].get('Email')
    user_password = session['user'].get('Password') # Use .get() to avoid KeyError

    if user_email and user_password:
        try:
            response = requests.post(PRO_SHEET_URL, data={
                "action": "login", # I use login action to fetch latest data
                "Email": user_email,
                "Password": user_password # Password must be in session for this
            }, timeout=5)

            res_data = response.json()
            if res_data['status'] == "success":
                session['user'] = res_data['user'] # Update session with latest 'Verified' status
                session['user']['password'] = user_password
        except:
            pass

    return render_template('dashboard.html', user=session['user'])

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('membership_page'))

# Pro membership End


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

    