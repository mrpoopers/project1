class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.inventory = new Set(); // use a Set to track items
        this.engine.addChoice("Go Down");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.key = key;
        this.engine.show(locationData.Body);

        // Pickup item if present
        if (locationData.Item && !this.engine.inventory.has(locationData.Item)) {
            this.engine.inventory.add(locationData.Item);
            this.engine.show(`* You pick up a ${locationData.Item}.`);
        }

        // Handle interaction (like a radio)
        if (locationData.Interactive === "Radio") {
            this.engine.addChoice("Turn on the radio", { InteractiveAction: "Radio" });
        }

        // Display valid choices
        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                if (choice.Item && !this.engine.inventory.has(choice.Item)) {
                    this.engine.show(`The path to ${choice.Text} is locked. You need the ${choice.Item}.`);
                    continue;
                }
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice.InteractiveAction === "Radio") {
            const messages = [
                "You hear static... then a distant voice.",
                "A message crackles through: 'Don't trust the lights.'",
                "A lullaby plays softly, eerie and sweet..."
            ];
            const msg = messages[Math.floor(Math.random() * messages.length)];
            this.engine.show(msg);
            this.engine.gotoScene(Location, this.key); // stay in current location
            return;
        }

        if (choice) {
            this.engine.show("&gt; " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

// Load the story
Engine.load(Start, 'myStory.json');


//hello