import { Hono } from "hono";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { connectDB } from "./db/config";
import VidModel from "./models/vid.model";
import { v4 as unique_id } from "uuid";

const app = new Hono();

app.use(poweredBy());
app.use(logger());

connectDB()
  .then(() => {
    console.log("Database connected");

    //show all videos
    app.get("/", async (c) => {
      const docs = await VidModel.find();
      return c.json(docs);
    });

    //i am creating a video
    app.post("/video", async (c) => {
      const { vidName, channelName, duration } = await c.req.json();
      try {
        const newVideo = new VidModel({
          _id: unique_id(),
          vidName: vidName,
          channelName: channelName,
          duration: duration,
        });
        await newVideo.save();
        return c.json({ message: "Video Document created" });
      } catch (error) {
        return c.json(`Error in creating : ${error}`);
      }
    });

    //now i will read a video by it's id
    app.get("/vid/:id", async (c) => {
      const { id } = c.req.param();
      if (!id) {
        return c.json({ message: "Id is incorrect or empty" });
      }
      try {
        const doc = await VidModel.findById(id);
        if (!doc) {
          return c.json({ message: "Not found in DB" });
        }
        return c.json({ doc });
      } catch (error) {
        return c.json({ error: error });
      }
    });

    //now i will update a video doc by it's id
    app.put("/vid/:id", async (c) => {
      const { id } = c.req.param();
      if (!id) {
        return c.json({ message: "Error in getting id" });
      }
      try {
        const { vidName, channelName, duration } = await c.req.json();
        const doc = await VidModel.findByIdAndUpdate(
          id,
          {
            vidName: vidName,
            channelName: channelName,
            duration: duration,
          },
          {
            new: true,
          }
        );
        if (!doc) {
          return c.json({ message: "Document not found" });
        }
        return c.json({ message: "Upadted Successfully", doc });
      } catch (error) {
        return c.json({ error: error });
      }
    });

    //now i will delete a video doc by id
    app.delete("/vid/:id", async (c) => {
      const { id } = c.req.param();
      try {
        const doc = await VidModel.findByIdAndDelete(id);
        if (!doc) {
          return c.json({ message: "Can't delete" });
        }
        return c.json({ message: "Deleted Successfully " });
      } catch (error) {
        return c.json({ message: "Something went wrong...", error });
      }
    });

    //now i will empty the db
    app.delete("/", async (c) => {
      try {
        const res = await VidModel.deleteMany({});
        return c.json({ message: "All Deleted", res });
      } catch (error) {
        return c.json({ message: error });
      }
    });
  })
  .catch((err) => {
    console.log(err);
    app.get("/*", (c) => {
      return c.text("Database connection failed");
    });
  });

app.onError((err, c) => {
  console.log(err);
  return c.text(`Internal Server Error: ${err.message}`, 500);
});

export default app;
