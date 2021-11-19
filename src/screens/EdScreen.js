import React from "react";
import {
	StyleSheet,
	View,
	FlatList,
	Text,
	TouchableOpacity,
	Image,
	Dimensions,
} from "react-native";
import { Box, VStack, NativeBaseProvider } from "native-base";

const EdScreen = ({ navigation }) => {
	//need to add the full text of each blog to the object array below, then render it in the BlogScreen
	const blogList = [
		{
			title: 'What is "Skin in the Game"?',
			date: "08/15/2021",
			preview:
				'There is no better indicator for "what one thinks" about an asset than where she moves hermoney.',
			imageLocation: require("../../assets/blog/skin.jpg"),
			fullBlogText:
				"Disclaimer: The content in this blog is for informational purposes only. It is not, in any way, financial advice. Under no conditions or circumstances should it be construed or interpreted as financial advice. \n\nFor more detailed descriptions of “Skin in the Game”, let us kindly refer you to Nassim Nicholas Taleb’s work on the matter. He wrote the book, “Skin in the Game: Hidden Asymmetries in Daily Life” and the article, “What do I mean by Skin in the Game? My Own Version”. We highly recommend checking them both out. \n\nBroadly speaking, to have skin in the game is to have exposure to risk when pursuing a goal. It is this very risk that mandates diligence when it comes to the execution of achieving that goal. This idea is best understood through real world examples, so let’s go through a few. \n\nWhen you move into a new rental home, your landlord will ask for a security deposit. Typically, the amount of this deposit is equal to one or two months of your rent. This is done to introduce skin in the game on your behalf. By locking up a significant sum of your hard-earned money (that you can only get back if you take good care of the landlord’s property), you are introducing the risk of losing that money. It is that risk that mandates (at least theoretically) that you will take care of the property. \n\nLet’s look at another example: the next time you get on a plane, which of the following would you prefer? The pilot of the plane onboard with you or the pilot controlling the plane remotely from the ground? The obvious answer here is the former: onboard with you. This is because in this case, the pilot has “skin in the game” or exposure to risk when trying to achieve the goal of getting you to your destination safely. If the pilot messes up, it’s not just you that goes down – she goes down with you. \n\nLastly, consider the following idea: ancient societies purportedly made their engineers sleep under the bridges they built periodically. The implication? Those engineers did everything they could to build robust bridges, mandated by the risk of losing their lives in slumber. Admittedly, it’s unclear whether this is historically accurate, but the point is abundantly clear either way. \n\nIn all three of the above examples, exposure to risk mandates diligence in pursuit of a goal, but what’s the point? How does this relate to finances or investing? The relation is clear: betting on or against an asset’s performance over time comes with exposure to risk (you could lose money). It is that very risk that mandates due diligence (extensive research) on the asset. People can share ideas on “how they think” a particular stock or asset will perform over time, but “what they think” is more or less worthless. There is no better indicator for “what one thinks” about an asset than where she moves her money. As Nassim Nicholas Taleb beautifully put in his book, “Skin in the Game: Hidden Asymmetries in Daily Life”, “Don’t tell me what you think, tell me what you have in your portfolio.”  \n\nPelleum is taking this idea to the next level, as it’s not only disclosing what investors own, but also how much they own, their monthly income, and where they move their money (all anonymously, of course). It is this full visibility that filters out all of the “fluff” and pierces through to exactly what one really thinks. Present-day finance media is optimized for clicks and watch time, not accuracy. This subsequently leads to skewed perceptions on investment opportunities, ultimately harming investors. Not anymore… Join us, and let’s bring accountability to retail investing.",
			blog_id: "1",
		},
		{
			title: "Starting From Scratch: Spend Less Than You Make",
			date: "08/23/2021",
			preview:
				"Now, while money, itself, will not increase in value over time, you need it to purchase property that will.",
			imageLocation: require("../../assets/blog/spendLess.jpg"),
			fullBlogText:
				"Disclaimer: The content in this blog is for informational purposes only. It is not, in any way, financial advice. Under no conditions or circumstances should it be construed or interpreted as financial advice. \n\nWhile there are many ways to build wealth from scratch, this article purposely focuses on illuminating guiding principles and practical first steps, rather than specific investment vehicles. There’s some ground work to lay, so let’s get right into it. \n\nBuilding wealth, through investments, starts with one guiding principle: do what benefits your future self. This means regularly making the choice to forego instant gratification for the benefit of “future you”. Many people may find this difficult, but this is crucial to internalize if you want to build wealth. Now, there is certainly a balance to be had here; you don’t want to spend your whole life forgoing in-the-moment gratification just to increase the value of your portfolio (for obvious reasons). That said, getting comfortable with making decisions for the betterment of your future self is a must when it comes to building wealth. \n\nNow that we’ve covered that, let’s talk about the first (and arguably most important) step that one must take on the journey to financial independence. Simple as it may be, the first step is to spend less money than you make. Without this, there is no investing. Investing requires capital (also known as, money). Now, while money, itself, will not increase in value over time, you need it to purchase property that will. For example, you need money to purchase: stocks (ownership in companies), real estate (buildings), Bitcoin, and any other form of property. Let this sink in for a moment. In order to build wealth, one must figure out how to consistently spend less than she makes. \n\nEveryone’s situation is different, so there is no “one size fits all” advice on how to achieve this, but let’s cover a few ideas that may, at the very least, be helpful to think about. First and foremost, let’s talk about rental expenses. For most renters, rent is the largest monthly expense, so if possible, it makes sense to reduce it. A renter could consider moving in with roommates (to reduce her share of rent), renting out unused rooms on Airbnb, or simply choosing a less expensive apartment. Next, let’s consider car payments. If you’re in a city with good public transportation alternatives, it may make sense for you to not even own a car. This would make a material impact on the amount of money you could save. If, however, you need a car, you could consider car rental services, like Turo, to make a few extra bucks when you’re not using it. Next, it would probably be worth your time to make a list of all of the monthly subscriptions you’re paying for and cancel any that you don’t use; these subscriptions can add up! Lastly, food is a large expense that could potentially be reduced. It is typically cheaper to buy food from grocery stores and cook at home. \n\nUp until this point, we’ve only discussed ways to reduce one’s expenses. However, there is another way to spend less than you make, and that’s to increase your income! This can be achieved in a variety of ways, and similar to the above, everyone’s situation is different. One can increase her income by switching jobs, starting a side hustle, or picking up “gig-work” (e.g., DoorDash, Uber, etc.). Switching jobs is probably the most direct way to accomplish an increase in income. \n\nNow that you’re a master at spending less than you make and making decisions that benefit your future self, you’re well on your way to financial independence! We’ll discuss next steps in next week’s Pelleum blog post.",
			blog_id: "2",
		},
		{
			title: "Set Up an Emergency Fund",
			date: "08/29/2021",
			preview:
				"Once you achieve your goal, stop contributing to your emergency fund!",
			imageLocation: require("../../assets/blog/emergency.jpg"),
			fullBlogText:
				"Disclaimer: The content in this blog is for informational purposes only. It is not, in any way, financial advice. Under no conditions or circumstances should it be construed or interpreted as financial advice. \n\nLife is full of beautiful experiences that can simply put a smile on one’s face. However, there are many unexpected events that can be hard to swallow (emotionally and financially). Although one can’t be fully prepared for such events, this week’s blog is aimed at helping you financially prepare for the unexpected. \n\nWhat is an emergency?\nAfter you manage to consistently spend less than you make, the next step is to set up an emergency fund (also known as a rainy day fund). An emergency fund is money that you set aside for one purpose: financial emergencies. It’s important to be conscious of what constitutes an emergency. This will ensure that you won’t touch this money unless you truly run into an emergency situation. \nEmergencies can be different for everyone, but here are a few common examples: \n1. Losing your job \n2. Medical bills (for yourself or loved ones) \n3. Car repair after an accident \n4. Essential home repairs (i.e. your toilet breaks) \n\nHow much should I save? \nWhen figuring out how much you should put into an emergency fund, a good rule of thumb is to save for 3-6 months of living expenses. Of course, this will vary depending on your individual situation and your risk tolerance. For example, if you have any high-interest debt, it probably makes sense to set aside $1,000 for emergencies, and to focus on getting rid of the debt before increasing the amount in your emergency fund. This amount is, in large part, dependent on your own peace of mind. If 9 months of fully covered living expenses helps you sleep better at night, then by all means, save 9 months worth! \n\nWhere do I store this money?\nThere are countless options to choose from when deciding where to store your emergency fund. We suggest looking into a bank that offers a high-yield savings account. A high-yield savings account will pay you a significantly higher interest rate than most traditional checking and savings accounts. Although the interest rates can vary over time, and will likely not keep up with inflation, it still makes sense to get the most interest possible on your hard-earned money. Remember, this money is not an investment; it’s for emergencies only! \nHere are some options to consider: \n1. Ally \n2. Chime \n3. Marcus by Goldman Sachs \n4. Capital One \n5. Varo \n\nHow do I save? \nTo expedite your emergency fund saving, you should set a goal. This means getting clear on a dollar amount and a time frame. First, figure out how much money you can comfortably save per paycheck. From there, figure out how many pay periods it will take to achieve your goal. For example, if your emergency fund goal is to save $3,000, and you can comfortably save $250 every paycheck (that you receive every 2 weeks), then it will take 12 paychecks (or 6 months) to achieve your goal. Once you achieve your goal, stop contributing to your emergency fund! The emergency fund is designed to cover a set time period of living expenses, not endlessly accumulate vast amounts of the ever-inflating US dollar! Next, if you want to make saving easier, the best way is to set automatic deposits to your savings account. By automating deposits, you ensure that you are consistently putting money toward your savings, and you don’t have to worry about making a manual transfer every time you get paid. \n\nHaving an emergency fund is fundamentally in line with the idea of doing what benefits your future self. We all encounter unexpected expenses. Being financially prepared for such events gives you peace of mind, and it prevents you from going into debt if you find yourself in a desperate situation. Now that you’re up to speed on emergency funds, tune in next week for the fundamentals of investing (the fun stuff)!",
			blog_id: "3",
		},
		{
			title: "Investing: What Is It?",
			date: "09/06/2021",
			preview:
				"In this light, you can think of investing as a way for you to fund projects that are meaningful to you.",
			imageLocation: require("../../assets/blog/investing.jpg"),
			fullBlogText:
				"Disclaimer: The content in this blog is for informational purposes only. It is not, in any way, financial advice. Under no conditions or circumstances should it be construed or interpreted as financial advice. \n\nBefore getting into investing, let’s lay the foundation by taking a moment for a brief refresher on what was covered the past two weeks. \n\nLet’s get up to speed \nThe first step on your journey toward financial independence is to understand and internalize the importance of making decisions for the betterment of your future self. From there, you must figure out how to consistently spend less money than you make (more on that here). This is arguably the most important step in this entire pursuit; without this step, there is no investing. You can think about this saved capital (money) as seeds that will one day grow into large, beautiful trees. In order for such trees to exist, there must first be seeds. \nAfter you’ve figured out how to consistently spend less money than you make, the next step is to prepare yourself financially for emergencies. This usually means accumulating 3-6 months of living expenses in a liquid, stable, readily available currency. If you have high-interest debt of any kind (e.g. high-interest credit card debt), it probably makes sense to cap your emergency fund at around $1,000 and then use all other available capital to pay off the debt. After that’s done, you can resume accumulating your emergency fund. For a deep dive on emergency funds, let me kindly direct you to “Set Up an Emergency Fund”, written by Ernesto Ramirez. \n\nI'm ready to invest \nNow that we’ve covered the foundation that will set you up to invest, it’s time to dive into investing (the fun stuff). So what is investing? On the surface, investing can be thought of as the acquisition of property that you believe will increase in value over time. Generally speaking, an increase in said property’s value is predicated on an increase in demand for that property. Typically, that demand is predicated on the value that the property produces or enables. Diving further, such value is normally a function of a problem that the property solves, however, this may not always be the case. For example, suppose you buy a house in a small to medium-size town. Such a house has a certain value ascribed to it, which is a function of the problem the house solves, the aesthetic, architectural appeal, and say, the location. Fundamentally, houses provide a solution to the problem imposed by harsh, outdoor elements (think a Chicago-style winter); they provide comfortable shelter from such unpleasant experiences. Now, imagine a scenario where multiple large, well-paying companies decide to set up shop in the town you bought the house in. With them comes thousands of new, well-paid individuals, all in need of housing. Some of them go one step further and want to impress their peers by buying aesthetically pleasing houses, as they believe they will acquire status by doing so. Now, what happens to the value of your house? Houses are a finite resource, meaning that one can not simply and readily create an infinite number of new houses on the spot. New houses can be and will be built in this scenario, but this takes time. Moreover, there is a finite amount of land in the town and surrounding area where it logistically makes sense to travel to work. So what do we have here? We have a scenario where there is a slowly increasing number of new houses being built and a quickly increasing number of well-paid town residents who all want places to live. In such a scenario, the aggregated demand for the available houses increases, and subsequently, the amount of money people are willing to pay for an individual house in the area increases. The implication? The property you bought increased in value over time. \n\nProductive vs non-productive assets \nWhen it comes to making an investment, there are many different forms of property one can buy. To name a few, there are: houses, land, shares of companies (private and public), Bitcoin, artwork, etc. There are also different distinctions of assets (property): productive assets and non-productive assets. Let’s illustrate the difference: a productive asset is an asset that uses resources to produce value and exchanges that value for revenue (e.g. a farm, a factory, a software company, etc.). A non-productive asset is an asset that does not use resources to produce value (e.g. precious metals, artwork, collectible playing cards, etc.). Productive assets introduce a new dimension to investing. Productive assets do not just naturally appear; they need to be built in the pursuit to solve a problem. In many cases, such a pursuit requires capital (money) to be accomplished. For example, the vast majority of large businesses that exist today at some point raised money to get off the ground. In this light, investing can be thought of in the following manner: you have money to invest, and an entrepreneur needs money to start her business. You make a deal with her; you tell her you’ll give her an agreed upon amount of money, so that she can get her business off the ground, but in return, you want to own an agreed upon percentage of her company. If her company grows in value, and the number of shares in the company stays constant, your “slice of the pie”, so to speak, grows proportionally! In this light, you can think of investing as a way for you to fund projects that are meaningful to you and that you think will benefit people. In my opinion, this extra dimension that early stage projects bring to investing makes it all the more exciting! When it comes to investing in public markets, the benefit a company, or “project”, receives when you invest in it is less direct than in private markets, but they still benefit. The sentiment is still there! \n\nTo recap, investing is the acquisition of assets (property) that you believe will increase in value over time. In order to make an investment, you first need money to invest. Provided you figure out how to consistently spend less money than you make, you can then consistently invest your money into assets you think will increase in value over time relative to your native currency. It is this very consistency that makes all the difference over time. Tune in next week to learn about ”dollar cost averaging” (consistent, periodic investing).",
			blog_id: "4",
		},
		{
			title: "Dollar Cost Averaging",
			date: "09/14/2021",
			preview:
				"Dollar cost averaging ensures two main things: that you do not try to time the market, and that you consistently increase the size of your portfolio over time.",
			imageLocation: require("../../assets/blog/dca.jpg"),
			fullBlogText:
				"Disclaimer: The content in this blog is for informational purposes only. It is not, in any way, financial advice. Under no conditions or circumstances should it be construed or interpreted as financial advice. \n\nAs discussed in last week’s blog, investing can be thought of as the acquisition of property that you believe will increase in value over time. The next step is to figure out an investing strategy that works for you. Why? Because without a strategy, investing can be very stressful, and it doesn’t have to be that way! For this reason, we will focus this week’s blog on the most popular investing strategy among long-term investors: dollar cost averaging. Why is it so popular? We think it’s because of its simplicity, effectiveness, and how easy it is to adopt. Let’s get into it! \n\nWhat is dollar cost averaging? \nWhen you invest, you have to be aware of the fact that prices fluctuate constantly as a function of demand. This is called market volatility, and it can be directly translated into risk. Generally speaking (not always), the higher the volatility, the higher the risk. Although risk is important to consider when investing, short-term price volatility will be relatively insignificant in the long-run. This is why long-term investors opt for investment strategies that neglect (or neutralize) short-term market volatility. Now, what is dollar cost averaging and how does it relate to all of this? Dollar cost averaging is a strategy that aims to minimize the risk related to market volatility by spreading out your investment purchases over time. This means buying at regular time intervals and roughly equal amounts over an extended period of time. Dollar cost averaging ensures two main things: that you do not try to time the market, and that you consistently increase the size of your portfolio over time. \n\nWhy is dollar cost averaging effective? \nInvestors who try to time the market can experience a lot of stress are more prone to make emotional trading decisions. By adopting a long-term strategy, like dollar cost averaging, the stress and emotions that come with investing can be greatly reduced. Mainly because you will not be constantly worrying about prices going up or down. Additionally, the value of your portfolio will grow more steadily as a result of abiding by a set schedule and dollar amount to invest. Dollar cost averaging is especially useful in retirement accounts, since the money invested in these accounts is not meant to be taken out until you reach a certain retirement age, which is pretty distant for most of us. For example, say you dollar cost average for 35 years, investing $250 every month into property that returns an average of 10% per year. You would be looking at $813,000 when you retire and are ready to start selling and taking some of that money out! That's the power of long-term investing through dollar cost averaging, all without stressing out about the price volatility that happens in the short term. \n\nHow do I implement dollar cost averaging into my portfolio? \nThe most important aspect of dollar cost averaging is the schedule that you will commit to. You need to decide how much and how often you want to buy an investment. For example, you can commit to buying $250 worth of some property every 30 days, and you must stick to this plan. The best way to dollar cost average is through automation. To do this, we can break it down for you into four steps: \n\n1. Set up automatic deposits to your brokerage account. For example, every time you get paid, $125 of your paycheck gets direct-deposited to your brokerage account. This will ensure that your account has sufficient funds at the time of buying. \n\n2. Choose where you want to invest your money (i.e. what you want to buy). This is the hardest part of the process, since it requires a significant amount of research. The key thing to remember here is to only invest into the things you understand and believe will increase in value over time. Pelleum’s mission is to make this process easier! \n\n3. Figure out how much you want to buy. This will depend on the funds in your account, how much is being deposited regularly, and your conviction on each investment. For example, if you deposit $250 into your brokerage account every month, the maximum amount you can invest every month is $250. Additionally, if you want to invest into shares of multiple companies or funds, you have to figure out how you want to divide your investment money up. \n\n4. Set up an automatic investment schedule. Doing this will vary depending on the brokerage and software that they use, but generally speaking, it’s pretty straight forward. For example, you can tell the brokerage to invest $50 into shares of Company A, $100 into shares of Company B, and $100 into shares of Company C, on the 1st day of every month. This way, you won’t have to worry about manually making these purchases every month! \n\nLike any investing strategy, dollar cost averaging may not be for everyone, but it sure is a powerful strategy to consider when it comes to long-term investing. The primary benefits of dollar cost averaging are the reduction of stress related to market volatility, avoiding the temptation to time the market, and ensuring that you consistently invest equal amounts into property that you have positive, long-term conviction on.",
			blog_id: "5",
		},
		{
			title: "Pay Yourself First",
			date: "10/03/2021",
			preview: "If you don't pay yourself first, no one will.",
			imageLocation: require("../../assets/blog/payYourselfFirst.jpg"),
			fullBlogText:
				"Disclaimer: The content in this blog is for informational purposes only. It is not, in any way, financial advice. Under no conditions or circumstances should it be construed or interpreted as financial advice. \n\nNow that you know what investing is and what dollar cost averaging is, it’s time to discuss one of the most important wealth-building concepts: paying yourself first. Fundamentally, the idea of paying yourself first is a frame of mind more than it is any one isolated action. It is a frame of mind, from which you can build sustainable, long-term financial habits. Your time is your most valuable asset, so let’s get right into it. \n\nIt’s easier said than done. \nEach of you reading this, at some point, gets paid. Whether you get paid every two weeks from your day job, or in the case of freelancers, more sporadically, money finds its way into your custody. It is at this very moment that you have a decision to make: you decide what to do with that money. While the possibilities are vast, all boil down into two categories: give money to someone else or give money to yourself. To elucidate, in this case, giving money to someone else could mean: paying bills, buying goods and services, paying taxes, or giving it away. So okay, we have two choices: pay ourselves first or pay others first. You may be intuitively thinking that the choice is easy; everyone wants to pay themselves first! Not so fast — it’s easier said than done. There is no shortage of stimuli you face, each with compelling reasons to transfer your money out of your custody. To name a few, you may have: rent, car payments, monthly subscriptions, food expenses, nights at the bar with your friends, license plate renewals, wedding gifts to give, hair products to buy, or a shopping addiction. None of these even take into account unforeseen events, for which, you should have an emergency fund (more on that here). The point is that saying, “I’ll pay myself first” is different (and far easier) than actually paying yourself first. That said, it is this very repeated decision that, over time, has the power to make you financially independent. At the end of the day, you work hard for your money (potentially unfavorably spending your time), so it makes sense that you reap the fruits of your labor before anyone else does. \n\nOkay, so how do I pay myself first? \nWhen it comes to paying yourself first, automation is the best approach. In other words, the more money you can automate out of the control of your emotional, monkey hands, the better. Did I just say that? It must have slipped out. Let me give you an example: you could set up your direct deposit from work to automatically deposit an amount of your money into an account of your choice, so that any money that makes its way into your checking account does so after you’ve been paid first. If you do not have the option of direct deposit, you could set up your brokerage or cryptocurrency account to automatically pull an amount of money out of your checking account on the days you get paid. Now, while automation is great, you’ll need more than that. As mentioned above, paying yourself first is a mindset, and I believe that it’s not necessarily something you can just automate and forget about. It may require a paradigm shift as it pertains to how you think about money. When one gets paid, instead of thinking, “what bills do I need to pay?”, the person who pays herself first thinks, “what assets can I buy?” If you find that the latter is impossible, because you have too many bills, then you must systematically reduce the amount of money you spend on bills (more ideas on how here), or you must figure out how to increase your income (or both). Regardless of how you choose to accomplish this, you must figure out how to make paying yourself possible. Specially, you must figure out to consistently purchase a previously decided upon amount of assets each and every time you get paid, with no exceptions. To be absolutely clear, I’d like to provide you with an example. Suppose someone gets paid $2,000 every two weeks. She decides that every paycheck, she will invest $1,000. To accomplish this, she sets up her direct deposit at work to automatically deposit the $1,000 into her brokerage account, where she can later invest it. What’s the implication here? Before a single dollar gets deposited into her checking account (where it can be used for bills, food, entertainment, etc.), $1,000 was already deposited into her brokerage account — she paid herself first. Paying yourself first must be non-negotiable. If you don’t pay yourself first, no one will.",
			blog_id: "6",
		},
	];

	const dimensions = Dimensions.get("window");
	const imageHeight = Math.round((dimensions.width * 9) / 16);

	return (
		<View style={styles.mainContainer}>
			<FlatList
				data={blogList}
				keyExtractor={(item) => item.blog_id}
				renderItem={({ item }) => (
					<NativeBaseProvider>
						<TouchableOpacity
							style={styles.readMoreButton}
							onPress={() => {
								navigation.navigate("Blog", {
									imageSource: item.imageLocation,
									blogDate: item.date,
									blogTitle: item.title,
									blogContent: item.fullBlogText,
								});
							}}
						>
							<Box style={styles.blogPostBox}>
								<VStack>
									<Image
										style={{ width: dimensions.width, height: imageHeight }}
										source={item.imageLocation}
										//resizeMode={"contain"}
									/>
									<Text style={styles.titleText}>{item.title}</Text>
									<Text style={styles.previewText}>{item.preview}</Text>
								</VStack>
							</Box>
						</TouchableOpacity>
					</NativeBaseProvider>
				)}
			></FlatList>
		</View>
	);
};

export default EdScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	blogPostBox: {
		backgroundColor: "#ebecf0",
		borderWidth: 1,
		borderColor: "#dedfe3",
		borderRadius: 15,
		marginTop: 5,
		overflow: "hidden",
        // shadowColor: "#000",   Shaddow isn't working for some reason
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.5,
        // elevation: 5
	},
	image: {
		width: 200,
	},
	titleText: {
		fontWeight: "bold",
		fontSize: 18,
		marginVertical: 5,
		paddingHorizontal: 5,
	},
	previewText: {
		fontSize: 16,
		marginVertical: 5,
		paddingHorizontal: 5,
	},
	readMoreButton: {
		padding: 10,
		alignSelf: "center",
	},
	readMoreText: {
		color: "blue",
	},
});
