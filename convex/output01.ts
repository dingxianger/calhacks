import { internal } from "./_generated/api";
import { internalMutation, mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const clearMenu = mutation({
    handler: async(ctx) => {
      console.log("clearMenu is called");
    var meal = await ctx.db.query("output01").first();
    while(meal) {
      await ctx.db.delete(meal._id);
      meal = await ctx.db.query("output01").first();
    }
  }
});

export const recordOutput = mutation({
    
    args: { output: v.string() },
    handler: async (ctx, {output}) => {
      const lines = output.split("\n");
      var i = lines[2].indexOf("Name: ");
      const name = lines[2].substring(6 + i, lines[2].length);
      i = lines[3].indexOf("Calories: ");
      const calories = lines[3].substring(10 + i, lines[3].length);
      i = lines[4].indexOf("Price: ");
      const price = lines[4].substring(7 + i, lines[4].length);
      i = lines[5].indexOf("Description: ");
      const description = lines[5].substring(13 + i, lines[5].length);
      await ctx.db.insert("output01", {name, calories, price, description});

    //   await ctx.db.insert("input01", {dietaryRestriction, calories, price});
    //   const message = "What I don't eat: " + dietaryRestriction + ", and my budget is "
    //    + price + ", please give me a suggestion of a meal that is under " + calories + 
    //    " calories in the format of Name | Calories | Price."
    //    console.log("before running chat in input01.ts");
    //   ctx.scheduler.runAfter(0, internal.openai.chat, {message});
    //   console.log("after running chat in input01.ts");
    },
});

export const list = query({
    handler: async (ctx): Promise<Doc<"output01">[]> => {
      // Grab the most recent messages.
      const meals = await ctx.db.query("output01").order("desc").collect();
      // Reverse the list so that it's in chronological order.
      return meals.reverse();
    },
  });


